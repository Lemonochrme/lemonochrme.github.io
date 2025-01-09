---
layout: post
title: 🔒 Security for Connected Objects
date: 2024-11-18
categories: [INSA]
image: /assets/covers/energy.png
---

# Interprétation Concrète

# Interprétation Abstraite

## Préambule

Domaines d'abstraction :
- Intervalle
- Parité
- Chaîne de caractères

```
char *s = "abc";
s = {abc}
strcat(z, s)
z = .*abc
```

## Domaine des Intervalles

Notation : s = [a, b]  *le domaine de s est [a, b]*

```c
a = [a1, a2]
b = [b1, b2]
a + 1 = [a1 + 1, a2 + 1]
b + 1 = [b1 + 1, b2 + 1]
-b = [-b2, -b1]
a - b = [a1 - b2, a2 - b1]
a * b = [min(a1 * b1, a1 * b2, a2 * b1, a2 * b2), max(a1 * b1, a1 * b2, a2 * b1, a2 * b2)]
```

## Structures de Controle

```
a = b + 5 * c
b : [b1, b2]
5  : [5, 5]
c : [c1, c2]
donc a : [b1 + 5 * c1, b2 + 5 * c2]
```
Cas d'`input()` : [-inf, +inf]

Comment interpréter un code de manière abstraite :

```
if(c<d) {
...
} else {
...
}
```

On considère 2 domaines : un dans le `if` et un dans le `else`, si la condition else n'est jamais appellée on peut uniquement considérer un seul domaine et inversement.

E.g. :
```
c : [-20, 32]
d : [4, 64]

if (c < d) {
    // Domaine dans le if
    c = [-20, 32]
    d = [4, 64]
    // c < d est vrai donc c : [-20, 32] et d : [4, 64]
} else {
    // Domaine dans le else
    c = [4, 32]
    d = [4, 32]
}
```

Cas domaine infini :

```
c : [4, 8] 
d : [-inf, +inf]

while(c>d) {

}
```


## Réflexion sur l'ascpect sécurité de notre projet interdisciplinaire