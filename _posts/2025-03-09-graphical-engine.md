---
layout: post
title: Simple Graphical Engine
date: 2025-03-09
categories: [Personnal]
image: https://github.com/user-attachments/assets/fa5442fd-eb30-4976-98d5-264942c3b7c3
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


