"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ThemeToggle } from "@/components/theme-toggle"
import { Eye, EyeOff, Database, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular autenticación
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Login attempt:", { email, password, rememberMe })
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-4 animate-in fade-in-0 slide-in-from-top-4 duration-1000">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Database className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground dark:text-foreground">DataBridge</h1>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">Bienvenido de vuelta</h2>
            <p className="text-muted-foreground">Accede a tu sistema ERP empresarial</p>
          </div>
        </div>

        <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-card/95 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-300">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-xl font-semibold text-card-foreground">Iniciar Sesión</CardTitle>
            <CardDescription className="text-muted-foreground">Ingresa tus credenciales para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input/50 border-border/50 focus:ring-ring/50 focus:border-ring transition-all duration-300 hover:bg-input/80"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-input/50 border-border/50 focus:ring-ring/50 focus:border-ring pr-12 transition-all duration-300 hover:bg-input/80"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                    Recordarme
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80 dark:text-slate-200 dark:hover:text-white transition-colors duration-300 hover:underline disabled:opacity-50"
                  disabled={isLoading}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium py-3 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center space-y-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-500">
          <p className="text-sm text-muted-foreground">
            ¿Necesitas ayuda?{" "}
            <button className="text-primary hover:text-primary/80 dark:text-slate-200 dark:hover:text-white transition-colors duration-300 hover:underline">
              Contactar Soporte
            </button>
          </p>
          <p className="text-xs text-muted-foreground/80">© 2024 DataBridge ERP. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}
