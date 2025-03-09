---
layout: post
title: Simple Graphical Engine
date: 2025-03-09
categories: [Personnal]
image: https://github.com/user-attachments/assets/c1fdff2a-5b24-4e05-b2a4-176d6f3d0826
description: "Developping a simple minimal graphical engine in C using Xlib."
---

# Introduction

The goal is to learn how graphical engines works by creating one from scratch.

# Boiler Plate

```c
#include <X11/Xlib.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

#define WIN_WIDTH 1280
#define WIN_HEIGHT 720


int main() {
    Display *display;
    Window window;
    XEvent event;
    int screen;
    
    display = XOpenDisplay(NULL);
    if (display == NULL) {
        fprintf(stderr, "Cannot open display\n");
        exit(1);
    }
    
    screen = DefaultScreen(display);
    window = XCreateSimpleWindow(display, RootWindow(display, screen), 10, 10, WIN_WIDTH, WIN_HEIGHT, 1,
                                 BlackPixel(display, screen), WhitePixel(display, screen));
    
    XSelectInput(display, window, ExposureMask | KeyPressMask);
    XMapWindow(display, window);
    
    GC gc = XCreateGC(display, window, 0, NULL);
    XSetForeground(display, gc, BlackPixel(display, screen));
    
    while (1) {
        XNextEvent(display, &event);
        if (event.type == Expose) {
            XDrawRectangle(display, window, gc, 200, 200, 400, 200);
        }
        if (event.type == KeyPress)
            break;
    }
    
    XCloseDisplay(display);
    return 0;
}
```

![image](https://github.com/user-attachments/assets/aa751b9c-83be-4e9f-b51b-dfd0defba962)


# Frame Buffer

What is a framebuffer? A framebuffer is simply an array in memory where each element represents a pixel to be displayed on the screen. This involves:
- Allocating a buffer in RAM (an array of unsigned integers).
- Manipulating the pixels directly.
- Copying this buffer to the screen using XImage.

## Implementation

The implementation of the framebuffer is rather simple :
- Declaration of a framebuffer array `unsigned int framebuffer[WIN_WIDTH * WIN_HEIGHT]` so we can store the individual pixels before displaying them onscreen.
- Creation of a `put_pixel(x, y, color)` function so we can directly modify pixels in the framebuffer.
- Using XImage for displaying the image stored in RAM.

We can then use the `put_pixel` function to draw a line for example :

```c
for (int i = 0; i < 500; i++) {
    put_pixel(100 + i, 100 + i, 0xFFFFFF);
}
```

![image](https://github.com/user-attachments/assets/4afc9794-d975-45a4-81b5-cc1883c4500e)


## Draw Text

In order to draw text onscreen we have to define the font using a 8 bit bitmap for each characters :

```c
const uint8_t font[26][8] = {
    { // A
        0b00111100,
        0b01000010,
        0b10000001,
        0b10000001,
        0b11111111,
        0b10000001,
        0b10000001,
        0b10000001
    },
}
```

We can now write a function to draw the individual characters using the `put_pixel` function created earlier :

```c
void draw_char(int x, int y, char c, unsigned int color) {
    int index = c - 'A'; 

    for (int i = 0; i < 8; i++) {
        for (int j = 0; j < 8; j++) {
            if (font[index][i] & (0b10000000 >> j)) {
                put_pixel(x + j, y + i, color);
            }
        }
    }
}
```

```c
    draw_char(1280/2, 720/2 - 100, 'H', 0xFFFFFF);
    draw_char(1280/2, 720/2 - 90, 'E', 0xFFFFFF);
    draw_char(1280/2, 720/2 - 80, 'L', 0xFFFFFF);
    draw_char(1280/2, 720/2 - 70, 'L', 0xFFFFFF);
    draw_char(1280/2, 720/2 - 60, 'L', 0xFFFFFF);
    draw_char(1280/2, 720/2 - 50, 'O', 0xFFFFFF);
    draw_char(1280/2, 720/2 - 30, 'W', 0xFFFFFF);
    draw_char(1280/2, 720/2 - 20, 'O', 0xFFFFFF);
    draw_char(1280/2, 720/2 - 10, 'R', 0xFFFFFF);
    draw_char(1280/2, 720/2, 'L', 0xFFFFFF);
    draw_char(1280/2, 720/2 + 10, 'D', 0xFFFFFF);
```

Result :

![image](https://github.com/user-attachments/assets/16c134a4-87ca-4a77-841f-bdc68416fbf4)


Next Steps :
- Double buffering to avoid flicklering
- Geometrical shapes
- Creation of a Z-buffer to handle depth
