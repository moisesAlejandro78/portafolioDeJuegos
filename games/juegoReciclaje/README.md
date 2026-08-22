# 🥦 NutriMaze: Carrera Saludable

Videojuego arcade educativo de laberinto inspirado en los clásicos, con temática de nutrición y mecánicas propias.

## Cómo jugar

1. Abre el archivo `index.html` en cualquier navegador moderno (Chrome, Firefox, Edge, Safari).
2. También puedes servir la carpeta con un servidor local:
   ```bash
   cd nutrimaze
   python3 -m http.server 8080
   ```
   Luego visita `http://localhost:8080`.

## Controles

- **Teclado**: Flechas ↑ ↓ ← → o WASD
- **Móvil / Touch**: Botones direccionales en pantalla

## Objetivo

Recorre el laberinto, recoge **todos los alimentos saludables** 🥦🍎🥕 y llega a la **salida** 🚪 sin ser atrapado por los enemigos.

## Mecánica de Equilibrio Nutritivo

| Tipo de comida | Efecto |
|----------------|--------|
| 🥦 Saludable (brócoli, manzanas, zanahorias, arvejas…) | + velocidad, personaje más ágil y delgado |
| 🍔 Chatarra (hamburguesas, donas, pizza…) | − velocidad, personaje más grande y lento |

- **Ágil** (equilibrio alto): máxima velocidad y facilidad para escapar
- **Equilibrado**: estado ideal
- **Pesado**: lento y vulnerable
- Si llegas a 0 de equilibrio → animación de “explosión de grasa” caricaturesca y derrota

## Enemigos

| Enemigo | Comportamiento |
|---------|----------------|
| 🔴 Roko | Persigue directamente al jugador |
| 🟣 Bombo | Se mueve de forma aleatoria |
| 🟢 Chispa | Cambia de dirección con frecuencia |
| 🟠 Traga | Patrulla zonas del mapa |

## Power-ups

- ⚡ **Súper Energía**: aumento temporal de velocidad
- 🛡️ **Escudo Nutritivo**: un impacto gratis
- 🥕 **Súper Vegetal**: reduce el efecto de la comida chatarra
- ✨ **Multiplicador**: puntos x2 por unos segundos

## Niveles

1. Escuela Saludable  
2. Parque de las Frutas  
3. Supermercado  
4. Centro de Bienestar  
5. Granja Saludable  

Cada nivel introduce más enemigos, más comida chatarra y laberintos más complejos. Al completar un nivel aparece una tarjeta educativa “¿Sabías que…?”.

## Skins

Desbloquea nuevos personajes completando niveles:

- 🥕 Chef Nutri  
- 🥦 Vegetalín  
- 🍎 Manzanito  
- ⚡ Turbo  
- 🤖 Robo-Nutri  
- 🧑‍🚀 Nutri Explorer  

## Características técnicas

- HTML5 Canvas + JavaScript puro (sin dependencias)
- Responsive y con controles táctiles
- Animaciones, partículas y feedback visual
- Interfaz moderna en español

¡Disfruta y aprende jugando!
