import mongoose from "mongoose";
import Product from "../models/Product.js";
import HistorialVenta from "../models/HistorialVenta.js";

/**
 * Middleware para verificar businessId
 */
const requireBusinessId = (req, res) => {
  const businessId = req.user?.businessId;
  
  if (!businessId) {
    res.status(403).json({ 
      success: false,
      message: "Usuario no asociado a un negocio válido" 
    });
    return null;
  }
  
  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    res.status(403).json({ 
      success: false,
      message: "ID de negocio no válido" 
    });
    return null;
  }
  
  return businessId;
};

/**
 * Registrar venta en el historial
 */
const registrarVentaHistorial = async (ventaData, session) => {
  try {
    const venta = new HistorialVenta(ventaData);
    await venta.save({ session });
    return venta;
  } catch (error) {
    console.error("Error al registrar venta en historial:", error);
    throw new Error("No se pudo registrar la venta en el historial");
  }
};

/**
 * Vender producto - CONTROLADOR PRINCIPAL
 */
export const venderProducto = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    // 1. Validar businessId del usuario
    const businessId = requireBusinessId(req, res);
    if (!businessId) {
      await session.abortTransaction();
      return;
    }

    // 2. Validar parámetros
    const { productId } = req.params;
    const { cantidad, precio_unitario, ganancia } = req.body;

    if (!cantidad || cantidad <= 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "La cantidad debe ser mayor a cero"
      });
    }

    if (!precio_unitario || precio_unitario <= 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "El precio unitario debe ser mayor a cero"
      });
    }

    if (ganancia === undefined || ganancia === null) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "La ganancia es requerida"
      });
    }

    // 3. Buscar el producto (con session)
    const product = await Product.findOne({
      _id: productId,
      business: businessId,
      isActive: true
    }).session(session);

    if (!product) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado o inactivo"
      });
    }

    // 4. Verificar stock
    if (product.cant < cantidad) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Stock insuficiente. Disponible: ${product.cant}, Solicitado: ${cantidad}`
      });
    }

    // 5. Actualizar stock
    product.cant -= cantidad;
    await product.save({ session });

    // 6. Registrar en historial
    const ventaRegistrada = await registrarVentaHistorial({
      fecha: new Date(),
      negocio: businessId,
      productoId: productId,
      productoNombre: product.title,
      cantidad: cantidad,
      precio_unitario: precio_unitario,
      total_venta: cantidad * precio_unitario,
      ganancia: ganancia
    }, session);

    // 7. Confirmar transacción
    await session.commitTransaction();
    
    // 8. Respuesta exitosa
    res.status(201).json({
      success: true,
      message: "Venta registrada exitosamente",
      data: {
        venta: ventaRegistrada,
        producto: {
          id: product._id,
          nombre: product.title,
          stock_actual: product.cant
        }
      }
    });

  } catch (error) {
    // Revertir transacción en caso de error
    await session.abortTransaction();
    
    console.error("Error en venderProducto:", error);
    
    res.status(500).json({
      success: false,
      message: "Error interno al procesar la venta",
      // Solo mostrar detalles del error en desarrollo
      ...(process.env.NODE_ENV === 'development' && {
        error: error.message,
        stack: error.stack
      })
    });
  } finally {
    // Cerrar sesión siempre
    await session.endSession();
  }
};

/**
 * Listar ventas - CONTROLADOR
 */
export const listarVentas = async (req, res) => {
  try {
    const businessId = requireBusinessId(req, res);
    if (!businessId) return;

    const { from, to, page = 1, limit = 10 } = req.query;

    // Construir filtro
    const filter = { negocio: businessId };
    
    // Filtrar por fecha si se proporciona
    if (from || to) {
      filter.fecha = {};
      if (from) filter.fecha.$gte = new Date(from);
      if (to) filter.fecha.$lte = new Date(to + 'T23:59:59.999Z');
    }

    // Opciones de paginación
    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
      sort: { fecha: -1 }
    };

    // Ejecutar consultas
    const [ventas, total] = await Promise.all([
      HistorialVenta.find(filter)
        .populate('productoId', 'title images category')
        .skip(options.skip)
        .limit(options.limit)
        .sort(options.sort),
      HistorialVenta.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        ventas,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error("Error en listarVentas:", error);
    
    res.status(500).json({
      success: false,
      message: "Error al obtener el historial de ventas",
      ...(process.env.NODE_ENV === 'development' && {
        error: error.message
      })
    });
  }
};