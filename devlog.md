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

## 02/04/2025
Enoncé :
> You are given a 0-indexed integer array nums. Return the maximum value over all triplets of indices (i, j, k) such that i < j < k. If all such triplets have a negative value, return 0. The value of a triplet of indices (i, j, k) is equal to (nums[i] - nums[j]) * nums[k].

Ma solution :
```c
long long maximumTripletValue(int* nums, int numsSize) {
    long long max = INT_MIN;
    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            for (int k = j + 1; k < numsSize; k++) {
                long long val = (long long)(nums[i] - nums[j]) * nums[k]; 
                if (val > max) {
                    max = val;
                }
            }
        }
    }

    return max > 0 ? max : 0;
}
```

## 03/04/2025
Même énoncé mais on doit réduire la complexité de O(n^3) à au plus O(n^2). Dans le cas contraire : "Time Limit Exceeded".

J'ai d'abord essayé l'algo suivant :

```c
long long maximumTripletValue(int* nums, int numsSize) {
    long long maxVal = 0;
    int maxPrefix = nums[0];  // max nums[i] where i < j

    for (int j = 1; j < numsSize - 1; j++) {
        for (int k = j + 1; k < numsSize; k++) {
            long long val = (long long)(maxPrefix - nums[j]) * nums[k];
            if (val > maxVal) {
                maxVal = val;
            }
        }
        if (nums[j] > maxPrefix) {
            maxPrefix = nums[j];
        }
    }

    return maxVal;
}
```

- On veut maximiser (nums[i] - nums[j]) * nums[k] avec i < j < k
- On parcourt d'abord tous les couples (j, k) avec j < k
- Pour chaque (j, k) on garde en mémoire le plus grand nums[i] vu avant j (maxPrefix)
- On calcule (maxPrefix - nums[j]) * nums[k] et on garde le max trouvé 
- Après avoir traité un j on met à jour maxPrefix si nums[j] est plus grand
- Finnalement, on retourne la plus grande valeur trouvée (ou 0 si aucune n’est positive)

Malheureusement, `Time Limit Exceeded 591 / 599 testcases passed` 😞 si proche du but...

On dois trouver mieux, au lieu d’utiliser 2 boucles imbriquées (O(n^2) super lent), on fait une seule boucle et on pré-calcule les meilleurs choix possibles. On trouve le max en une seule passe.

```c
long long maximumTripletValue(int* nums, int numsSize) {
    if (numsSize < 3) return 0;
    long long maxVal = 0;
    int maxPrefix = nums[0];

    int* suffixMax = (int*) malloc(numsSize * sizeof(int));
    suffixMax[numsSize - 1] = nums[numsSize - 1];
    for (int i = numsSize - 2; i >= 0; i--) {
        suffixMax[i] = (nums[i] > suffixMax[i + 1]) ? nums[i] : suffixMax[i + 1];
    }

    for (int j = 1; j < numsSize - 1; j++) {
        long long candidate = (long long)(maxPrefix - nums[j]) * suffixMax[j + 1];
        if (candidate > maxVal)
            maxVal = candidate;
        if (nums[j] > maxPrefix)
            maxPrefix = nums[j];
    }

    free(suffixMax);
    return maxVal;
}
```

Le code passe ! 🥳 Mais par contre on est classé 22% sur le runtime, c'est pas optimal... 
Il semble que les tests de leetcode ne soumettent jamais l'algo à un nums[] de moins de trois élements, on peut donc enlever le test `if (numsSize < 3) return 0;`.

Effectivement, c'était bien le cas top 1 hehe 

![image](https://github.com/user-attachments/assets/7f0573d9-2093-4f4c-acb5-d014ed23ab17)
