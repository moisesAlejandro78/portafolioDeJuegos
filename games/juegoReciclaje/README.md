# ♻️ reciclajEZ

Videojuego arcade educativo de clasificación de residuos.  
Identifica, apunta, dispara y recicla para salvar la ciudad.

## 📝 Descripción

**reciclajEZ** es un juego educativo en el que el jugador debe clasificar correctamente diferentes tipos de residuos.  
Un cañón móvil apunta automáticamente al residuo actual y el jugador elige el contenedor correcto. Si acierta, gana puntos y combos; si falla, pierde una vida y recibe una explicación educativa.

El juego combina acción rápida, sistema de combos y aprendizaje real sobre reciclaje.

## 🎯 Objetivo del jugador

- Clasificar correctamente la mayor cantidad de residuos posible.
- Mantener combos altos para multiplicar los puntos.
- Completar los 4 niveles.
- Aprender a diferenciar:
  - 🍎 Orgánico
  - 📄 Papel y cartón
  - 🥤 Plástico
  - 🍾 Vidrio

## 🎮 Género

- Arcade
- Educational
- Action

## 🕹️ Controles

| Acción                          | Control                          |
|---------------------------------|----------------------------------|
| Seleccionar contenedor Orgánico | Clic o tecla **1**               |
| Seleccionar contenedor Papel    | Clic o tecla **2**               |
| Seleccionar contenedor Plástico | Clic o tecla **3**               |
| Seleccionar contenedor Vidrio   | Clic o tecla **4**               |

El cañón se mueve automáticamente de izquierda a derecha y apunta al residuo. Al elegir un contenedor, el cañón dispara el residuo hacia él.

## 💡 Mecánica principal

1. Aparece un residuo en la parte superior de la pantalla.
2. El cañón se mueve y apunta automáticamente.
3. El jugador elige el contenedor correcto.
4. El cañón dispara el residuo.
5. Si aciertas → puntos + combo.
6. Si fallas → pierdes una vida y ves la explicación correcta.

### Sistema de puntos y combos

| Combo       | Multiplicador |
|-------------|---------------|
| 3 o más     | ×2            |
| 5 o más     | ×3            |
| 10 o más    | ×5            |

- Respuesta rápida (≤ 1.5 s) → **150 puntos** base  
- Respuesta normal → **100 puntos** base  
- Error → **-50 puntos** y se reinicia el combo

### Vidas
El jugador comienza con **3 vidas**. Al llegar a 0 se termina la partida.

## 🏆 Niveles

| Nivel | Nombre                     | Objetivo de aciertos |
|-------|----------------------------|----------------------|
| 1     | Aprendiendo a reciclar     | 20                   |
| 2     | Reciclando más rápido      | 30                   |
| 3     | Reciclaje avanzado         | 40                   |
| 4     | Caos reciclable            | 50                   |

Al completar cada nivel se muestra una evaluación según el mejor combo conseguido y aparece un **consejo educativo de reciclaje**.

## ♻️ Tipos de residuos

### 🍎 Orgánico
- Cáscara de banana 🍌
- Manzana 🍎
- Zanahoria 🥕
- Restos de comida 🍽️
- Hojas 🍂

### 📄 Papel y cartón
- Hoja de papel 📄
- Caja de cartón 📦
- Periódico 📰
- Revista 📖

### 🥤 Plástico
- Botella de plástico 🧴
- Vaso plástico 🥤
- Bolsa plástica 🛍️
- Envase plástico 🧃

### 🍾 Vidrio
- Botella de vidrio 🍾
- Frasco de vidrio 🫙
- Vaso de vidrio 🥛

## 📸 Captura de pantalla

![reciclajEZ](../../assets/reciclaje.png)

La captura muestra el juego **reciclajEZ**, con el cañón, el residuo actual y los cuatro contenedores de reciclaje.

## 🌱 Propósito educativo

El juego enseña de forma práctica y entretenida:

- A identificar correctamente los diferentes tipos de residuos.
- La importancia de separar la basura.
- Consejos reales de reciclaje al completar cada nivel.
- Que reciclar bien ayuda a reducir la contaminación.

Cada error muestra una explicación clara del contenedor correcto.

## ▶️ Cómo jugar

1. Abre el archivo `index.html` en cualquier navegador moderno (Chrome, Firefox, Edge, Safari).
2. También puedes servir la carpeta con un servidor local:

```bash
cd juegoReciclaje
python3 -m http.server 8080
