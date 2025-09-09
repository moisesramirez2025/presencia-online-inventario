import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  // ... busca user, valida password ...
  const token = jwt.sign(
    { id: user._id, businessId: user.business }, // 👈 mete businessId aquí
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  res.json({
    token,
    user: { id: user._id, name: user.name, businessId: user.business } // opcional para front
  });
};
