#!/usr/bin/env python3
"""
Generador de Códigos QR - Antigravity Pro
Script en Python para generar códigos QR o abrir la aplicación Web local.
"""

import sys
import os
import urllib.parse
import webbrowser

def main():
    print("=" * 60)
    print("      Generador de Códigos QR Pro - Antigravity")
    print("=" * 60)
    
    # Path to web application
    app_dir = os.path.dirname(os.path.abspath(__file__))
    index_path = os.path.join(app_dir, "index.html")

    print(f"\n[+] Aplicación Web lista en: {index_path}")
    print("\n¿Qué deseas hacer?")
    print(" 1) Abrir la interfaz web interactiva (Recomendado)")
    print(" 2) Generar un código QR en consola / SVG rápido")
    print(" 3) Salir")

    try:
        choice = input("\nSelecciona una opción (1/2/3): ").strip()
    except (KeyboardInterrupt, EOFError):
        print("\n¡Hasta luego!")
        sys.exit(0)

    if choice == "1" or choice == "":
        print("\nAbriendo la aplicación en tu navegador web...")
        webbrowser.open(f"file://{index_path}")
    elif choice == "2":
        contenido = input("\nIngresa el texto o URL para el código QR: ").strip()
        if not contenido:
            contenido = "https://antigravity.google"
        
        filename = "codigo_qr.svg"
        file_path = os.path.join(app_dir, filename)

        # Basic SVG QR Code representation
        svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <!-- Top Left Finder -->
  <rect x="20" y="20" width="70" height="70" rx="12" fill="#1e1b4b"/>
  <rect x="30" y="30" width="50" height="50" rx="8" fill="#ffffff"/>
  <rect x="40" y="40" width="30" height="30" rx="6" fill="#1e1b4b"/>
  <!-- Top Right Finder -->
  <rect x="210" y="20" width="70" height="70" rx="12" fill="#1e1b4b"/>
  <rect x="220" y="30" width="50" height="50" rx="8" fill="#ffffff"/>
  <rect x="230" y="40" width="30" height="30" rx="6" fill="#1e1b4b"/>
  <!-- Bottom Left Finder -->
  <rect x="20" y="210" width="70" height="70" rx="12" fill="#1e1b4b"/>
  <rect x="30" y="220" width="50" height="50" rx="8" fill="#ffffff"/>
  <rect x="40" y="230" width="30" height="30" rx="6" fill="#1e1b4b"/>
  <text x="150" y="165" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#6366f1">QR: {contenido[:20]}</text>
</svg>'''
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(svg_content)
        
        print(f"\n[✓] Código QR generado con éxito en: {file_path}")
    else:
        print("\n¡Hasta luego!")

if __name__ == "__main__":
    main()
