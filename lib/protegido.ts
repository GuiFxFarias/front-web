/* eslint-disable @typescript-eslint/no-unused-vars */
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

const SECRET_KEY = process.env.JWT_SECRET as string;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ sucesso: false, erro: 'Token ausente' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return res.status(200).json({ sucesso: true, dados: decoded });
  } catch (error) {
    return res
      .status(403)
      .json({ sucesso: false, erro: 'Token inválido ou expirado' });
  }
}
