import { validationResult } from 'express-validator';
import Product from '../models/Product.js';
import Business from '../models/Business.js';

/**
 * Obtener productos públicos (vitrina)
 * Filtra por término de búsqueda, categoría y negocio
 */
export const listPublic = async (req, res) => {
  try {
    const { q = '', category, business } = req.query;
    
    // Construir filtro de búsqueda
    const filter = {
      isActive: true,
      ...(q && { title: { $regex: q, $options: 'i' } }),
      ...(category && { category }),
      ...(business && { business })
    };

    const products = await Product.find(filter)
      .populate('business', 'name contactEmail') // Incluir info básica del negocio
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error en listPublic:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener productos públicos' 
    });
  }
};

/**
 * Obtener productos para administración (con restricción por negocio)
 */
export const listAdmin = async (req, res) => {
  try {
    const products = await Product.find({ business: req.user.businessId })
      .populate('business', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error en listAdmin:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener productos administrativos' 
    });
  }
};

/**
 * Crear nuevo producto (solo administradores)
 * Incluye validación de datos y manejo de errores
 */
export const create = async (req, res) => {
  // Validar datos de entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array()
    });
  }

  try {
    const { businessId } = req.user;
    
    // Verificar que el negocio existe
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Negocio no encontrado'
      });
    }

    // Preparar datos del producto
    const { title, description, price, images = [], category, cant } = req.body;
    
    const productData = {
      title: title.trim(),
      description: description?.trim() || '',
      price: Number(price),
      images: Array.isArray(images) ? images : [],
      category: category?.trim() || 'general',
      cant: Math.max(0, Number(cant || 0)),
      business: businessId,
      isActive: true
    };

    // Crear producto
    const product = await Product.create(productData);
    
    // Respuesta exitosa
    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: product
    });
  } catch (error) {
    console.error('Error en create product:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos de producto inválidos',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno al crear producto'
    });
  }
};

/**
 * Actualizar producto existente
 * Solo permite actualizar productos del mismo negocio
 */
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { businessId } = req.user;

    // Buscar y actualizar solo si pertenece al negocio del usuario
    const product = await Product.findOneAndUpdate(
      { _id: id, business: businessId },
      { $set: req.body },
      { 
        new: true, // Devuelve el documento actualizado
        runValidators: true // Ejecuta validaciones del schema
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado o no tienes permisos'
      });
    }

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: product
    });
  } catch (error) {
    console.error('Error en update product:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos de actualización inválidos',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno al actualizar producto'
    });
  }
};

/**
 * Eliminar producto (borrado suave cambiando isActive a false)
 * Alternativa: usar deleteOne() para eliminación permanente
 */
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const { businessId } = req.user;

    // Buscar y "eliminar" (desactivar) el producto
    const product = await Product.findOneAndUpdate(
      { _id: id, business: businessId },
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado o no tienes permisos'
      });
    }

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente',
      data: { id: product._id, title: product.title }
    });
  } catch (error) {
    console.error('Error en delete product:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno al eliminar producto'
    });
  }
};