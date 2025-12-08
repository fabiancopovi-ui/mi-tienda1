import os
import json
import time
import subprocess
import webbrowser

# ==========================================
# RUTAS PRINCIPALES
# ==========================================
BASE_DIR = r"C:\Users\Yamu\Desktop\mi tienda\mi-tienda"
PUBLIC_DIR = os.path.join(BASE_DIR, "public")
PRODUCTS_DIR = os.path.join(PUBLIC_DIR, "productos")
JSON_PATH = os.path.join(PUBLIC_DIR, "productos.json")

# ==========================================
# FUNCIONES JSON
# ==========================================
def cargar_json():
    if not os.path.exists(JSON_PATH):
        with open(JSON_PATH, "w", encoding="utf-8") as f:
            json.dump({"productos": []}, f, indent=2, ensure_ascii=False)
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
            return data.get("productos", [])
        except:
            return []

def guardar_json(lista):
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump({"productos": lista}, f, indent=2, ensure_ascii=False)

# ==========================================
# FUNCIONES DE ARCHIVOS
# ==========================================
def obtener_carpetas_productos():
    if not os.path.exists(PRODUCTS_DIR):
        os.makedirs(PRODUCTS_DIR)
    return [c for c in os.listdir(PRODUCTS_DIR) if os.path.isdir(os.path.join(PRODUCTS_DIR, c))]

def imagenes_en_carpeta(carpeta):
    ruta = os.path.join(PRODUCTS_DIR, carpeta)
    EXT = (".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".heic")
    if not os.path.exists(ruta):
        return []
    return [f for f in os.listdir(ruta) if f.lower().endswith(EXT)]

# ==========================================
# ACTUALIZAR FOTOS
# ==========================================
def actualizar_fotos_producto(producto):
    carpeta = producto["carpeta"]
    fotos_actuales = imagenes_en_carpeta(carpeta)
    nuevas_rutas = [f"/productos/{carpeta}/{f}" for f in fotos_actuales]
    if producto.get("fotos") != nuevas_rutas:
        producto["fotos"] = nuevas_rutas
        return True
    return False

# ==========================================
# LIMPIAR PRODUCTOS ELIMINADOS
# ==========================================
def limpiar_productos_eliminados(productos):
    carpetas = obtener_carpetas_productos()
    nuevos = []
    eliminados = []
    for p in productos:
        if p["carpeta"] in carpetas:
            nuevos.append(p)
        else:
            eliminados.append(p["nombre"])
    if eliminados:
        print("\n🧹 Eliminados (carpeta ya no existe):")
        for n in eliminados:
            print(" -", n)
    return nuevos

# ==========================================
# AUTO-SINCRONIZACIÓN
# ==========================================
def auto_sincronizar():
    productos = cargar_json()
    carpetas = obtener_carpetas_productos()
    carpetas_existentes = [p["carpeta"].lower() for p in productos]
    hubo_cambios = False

    for p in productos:
        if actualizar_fotos_producto(p):
            hubo_cambios = True
            print(f"🔄 Fotos actualizadas: {p['nombre']}")

    for carpeta in carpetas:
        if carpeta.lower() not in carpetas_existentes:
            fotos = imagenes_en_carpeta(carpeta)
            nuevo = {
                "id": carpeta.lower().replace(" ", "-"),
                "nombre": carpeta,
                "carpeta": carpeta,
                "precio": 0,
                "fotos": [f"/productos/{carpeta}/{f}" for f in fotos]
            }
            productos.append(nuevo)
            hubo_cambios = True
            print(f"🟢 Nuevo producto detectado: {carpeta}")

    nuevos = limpiar_productos_eliminados(productos)
    if nuevos != productos:
        productos = nuevos
        hubo_cambios = True

    if hubo_cambios:
        guardar_json(productos)
        print("\n✔ JSON actualizado correctamente.\n")
    else:
        print("\n✔ No hubo cambios.\n")

# ==========================================
# SINCRONIZACIÓN MANUAL
# ==========================================
def sincronizar():
    auto_sincronizar()
    input("ENTER para volver al menú...")

# ==========================================
# SELECCIONAR PRODUCTO
# ==========================================
def seleccionar_producto(productos_ordenados):
    os.system("cls")
    for i, p in enumerate(productos_ordenados, 1):
        print(f"{i:02d}. {p['nombre']:<35} ${p['precio']}")
    entrada = input("\nNúmero o parte del nombre (Enter para cancelar): ").strip().lower()
    if entrada == "":
        return None
    if entrada.isdigit():
        idx = int(entrada) - 1
        if idx < 0 or idx >= len(productos_ordenados):
            print("❌ Número inválido.")
            time.sleep(1)
            return None
        return productos_ordenados[idx]
    else:
        coinc = [p for p in productos_ordenados if entrada in p["nombre"].lower()]
        if len(coinc) == 0:
            print("❌ No encontrado.")
            time.sleep(1)
            return None
        if len(coinc) > 1:
            print("⚠ Varias coincidencias:")
            for p in coinc:
                print(" -", p["nombre"])
            print("\nEspecifique más texto.")
            time.sleep(2)
            return None
        return coinc[0]

# ==========================================
# FUNCIONES DE PRECIOS Y NOMBRES
# ==========================================
def cambiar_precio_individual(productos_ordenados):
    prod = seleccionar_producto(productos_ordenados)
    if not prod:
        return
    try:
        nuevo = float(input(f"Nuevo precio para {prod['nombre']}: "))
    except:
        print("❌ Precio inválido.")
        time.sleep(1)
        return
    prod["precio"] = nuevo
    guardar_json(productos_ordenados)
    print("✔ Precio actualizado.")
    time.sleep(1)

def cambiar_precio_lote(productos_ordenados):
    os.system("cls")
    print("Ingrese nuevo precio para TODOS los productos:")
    try:
        nuevo = float(input("Precio: "))
    except:
        print("❌ Precio inválido.")
        time.sleep(1)
        return
    for p in productos_ordenados:
        p["precio"] = nuevo
    guardar_json(productos_ordenados)
    print(f"✔ Precio actualizado para {len(productos_ordenados)} productos.")
    time.sleep(2)

def editar_nombre_producto(productos_ordenados):
    prod = seleccionar_producto(productos_ordenados)
    if not prod:
        return
    nuevo_nombre = input(f"Nuevo nombre para {prod['nombre']}: ").strip()
    if nuevo_nombre == "":
        print("Cancelado.")
        time.sleep(1)
        return
    prod["nombre"] = nuevo_nombre
    guardar_json(productos_ordenados)
    print("✔ Nombre actualizado.")
    time.sleep(1)

def copiar_precio(productos_ordenados):
    prod = seleccionar_producto(productos_ordenados)
    if not prod:
        return
    try:
        print(f"Precio actual de {prod['nombre']}: {prod['precio']}")
        confirmar = input("Copiar este precio a todos los demás productos? (S/N): ").lower()
        if confirmar != "s":
            return
        for p in productos_ordenados:
            if p != prod:
                p["precio"] = prod["precio"]
        guardar_json(productos_ordenados)
        print("✔ Precio copiado a todos los productos.")
        time.sleep(2)
    except:
        print("❌ Error al copiar precio.")
        time.sleep(1)

def diagnostico_visual(productos_ordenados):
    os.system("cls")
    print("======================================")
    print("      📊 DIAGNÓSTICO VISUAL")
    print("======================================")
    for p in productos_ordenados:
        fotos = p.get("fotos", [])
        print(f"{p['nombre']:<25} Fotos: {len(fotos)} Precio: ${p['precio']}")
    input("\nENTER para volver...")

# ==========================================
# BORRAR PRODUCTO / FOTOS INDIVIDUALES
# ==========================================
def borrar_producto(productos_ordenados):
    prod = seleccionar_producto(productos_ordenados)
    if not prod:
        return
    confirmar = input(f"¿Borrar producto completo {prod['nombre']}? (S/N): ").lower()
    if confirmar != "s":
        return
    carpeta = os.path.join(PRODUCTS_DIR, prod["carpeta"])
    try:
        for f in os.listdir(carpeta):
            os.remove(os.path.join(carpeta, f))
        os.rmdir(carpeta)
    except:
        pass
    productos_ordenados.remove(prod)
    guardar_json(productos_ordenados)
    print("✔ Producto eliminado.")
    time.sleep(1)

def borrar_fotos_producto(productos_ordenados):
    prod = seleccionar_producto(productos_ordenados)
    if not prod:
        return
    carpeta = os.path.join(PRODUCTS_DIR, prod["carpeta"])
    fotos = imagenes_en_carpeta(prod["carpeta"])
    if not fotos:
        print("⚠ No hay fotos para borrar.")
        time.sleep(1)
        return
    while True:
        os.system("cls")
        print(f"Fotos de {prod['nombre']}")
        print("-"*50)
        for i, f in enumerate(fotos, 1):
            print(f"{i:02d}. {f}")
        print("A. Borrar todas las fotos")
        print("0. Volver")
        print("-"*50)
        opcion = input("Opción: ").strip().lower()
        if opcion == "0":
            break
        elif opcion == "a":
            confirmar = input(f"¿Borrar TODAS las fotos de {prod['nombre']}? (S/N): ").lower()
            if confirmar == "s":
                for f in fotos:
                    try:
                        os.remove(os.path.join(carpeta, f))
                    except:
                        pass
                prod["fotos"] = []
                guardar_json(productos_ordenados)
                print("✔ Fotos eliminadas.")
                time.sleep(1)
                break
        elif opcion.isdigit():
            idx = int(opcion)-1
            if idx <0 or idx >= len(fotos):
                print("❌ Número inválido.")
                time.sleep(1)
                continue
            confirmar = input(f"¿Borrar {fotos[idx]}? (S/N): ").lower()
            if confirmar == "s":
                try:
                    os.remove(os.path.join(carpeta, fotos[idx]))
                    fotos.pop(idx)
                    prod["fotos"] = [f"/productos/{prod['carpeta']}/{f}" for f in fotos]
                    guardar_json(productos_ordenados)
                    print("✔ Foto eliminada.")
                    time.sleep(1)
                except:
                    print("❌ Error al eliminar foto.")
                    time.sleep(1)
        else:
            print("Opción inválida.")
            time.sleep(1)

# ==========================================
# CAMBIAR PRECIOS / NOMBRES / BORRAR / DIAGNÓSTICO
# ==========================================
def cambiar_precios():
    productos = cargar_json()
    productos_ordenados = sorted(productos, key=lambda x: x["nombre"].lower())
    while True:
        os.system("cls")
        print("======================================")
        print("     💲 GESTOR DE PRODUCTOS — MI TIENDA")
        print("======================================")
        print("1. Cambiar precio individual")
        print("2. Cambiar precio por lote")
        print("3. Editar nombre")
        print("4. Copiar precio a otros productos")
        print("5. Diagnóstico visual")
        print("6. Borrar producto completo")
        print("7. Borrar fotos individuales / todas")
        print("0. Volver")
        print("======================================")
        opcion = input("Opción: ").strip()
        if opcion=="0":
            break
        elif opcion=="1":
            cambiar_precio_individual(productos_ordenados)
        elif opcion=="2":
            cambiar_precio_lote(productos_ordenados)
        elif opcion=="3":
            editar_nombre_producto(productos_ordenados)
        elif opcion=="4":
            copiar_precio(productos_ordenados)
        elif opcion=="5":
            diagnostico_visual(productos_ordenados)
        elif opcion=="6":
            borrar_producto(productos_ordenados)
        elif opcion=="7":
            borrar_fotos_producto(productos_ordenados)
        else:
            print("Opción inválida.")
            time.sleep(1)

# ==========================================
# INICIAR PÁGINA AUTOMÁTICAMENTE
# ==========================================
def iniciar_pagina():
    try:
        procesos = subprocess.check_output("tasklist | findstr node", shell=True).decode()
        if "node.exe" in procesos:
            webbrowser.open("http://localhost:5173")
            return
    except:
        pass
    subprocess.Popen("cmd /c start npm run dev", cwd=BASE_DIR)
    time.sleep(2)
    webbrowser.open("http://localhost:5173")

# ==========================================
# MENÚ PRINCIPAL
# ==========================================
def menu():
    iniciar_pagina()
    auto_sincronizar()
    while True:
        os.system("cls")
        print("======================================")
        print("  🛒 GESTOR DE PRODUCTOS — MI TIENDA")
        print("======================================")
        print("1. Actualizar productos y fotos")
        print("2. Cambiar precios / nombres / borrar / diagnóstico")
        print("0. Salir")
        print("======================================")
        op = input("Opción: ").strip()
        if op=="1":
            sincronizar()
        elif op=="2":
            cambiar_precios()
        elif op=="0":
            break
        else:
            print("Opción inválida.")
            time.sleep(1)

# ==========================================
# INICIO POR DOBLE CLIC
# ==========================================
if __name__=="__main__":
    menu()
