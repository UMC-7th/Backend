import { Request, Response } from "express";

export const handleUserSignUp = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "실패" });
    }

    const User = { 
      username,
      email,
      password, };

    console.log("등록됐음:", User);

    res.status(201).json({ message: "성공", user: User });
  } catch (error) {
    console.error("오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};
