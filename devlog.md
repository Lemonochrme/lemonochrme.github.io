---
layout: default
title: Gallery
---

# LeetCode Devlog

## 01/04/2025

> Soit deux tableaux triés `nums1` et `nums2`, contenant respectivement `m` et `n` éléments. Le tableau `nums1` a assez de place (taille `m + n`) pour fusionner les deux. Le but est de fusionner `nums1` et `nums2` en un seul tableau trié, directement dans `nums1`.

Exemple :
```
Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
Output: [1,2,2,3,5,6]
```

Ma solution (non optimale mais O(M+N)) :
```c
void merge(int* nums1, int nums1Size, int m, int* nums2, int nums2Size, int n) {
    // 1. Concaténer les deux tableaux dans un seul tableau
    // 2. Trier le tableau
    // 3. Mettre le tableau dans nums1[]

    int temp[nums1Size];

    for (int i = 0; i < m; i++) {
        temp[i] = nums1[i];
    }

    for (int i = 0; i < n; i++) {
        temp[i + m] = nums2[i];
    }

    // tri
    for (int i = 0; i < m + n; i++) {
        for (int j = i + 1; j < m + n; j++) {
            if (temp[i] > temp[j]) {
                int t = temp[i];
                temp[i] = temp[j];
                temp[j] = t;
            }
        }
    }

    for (int i = 0; i < m + n; i++) {
        nums1[i] = temp[i];
    }

}
```