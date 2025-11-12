// Este middleware verifica el token JWT y el rol del usuario
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Token no enviado o mal formado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: 'Token inválido o expirado' });
  }
};

const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    const { rol } = req.usuario;

    if (!rolesPermitidos.includes(rol)) {
      return res.status(403).json({ msg: 'Acceso denegado: rol no autorizado' });
    }

    next();
  };
};

module.exports = { verificarToken, verificarRol };