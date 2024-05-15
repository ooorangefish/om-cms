import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Login() {
  const [input, setInput] = useState("");

  const handleLogin = () => {
    if (input === "admin") {
      localStorage.setItem("admin", "true");
      window.location.href = "/";
    } else {
      alert("密码错误");
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col gap-y-8 items-center justify-center">
      <p className="text-2xl font-bold">橙子音乐后台管理系统</p>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">登录</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">请输入管理员密码</Label>
            <Input
              id="password"
              type="password"
              required
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin}>
            登录
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
