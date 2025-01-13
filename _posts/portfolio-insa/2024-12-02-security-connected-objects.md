---
layout: post
title: 🔒 Security for Connected Objects
date: 2024-11-18
categories: [INSA]
image: /assets/covers/energy.png
---




# Descriptive Part

# Technical Part

## Lab 1: Introduction to mbedTLS library

Objectives:
- Determine secured cryptographic parameters using current standards recommandations;
- Create our own Certification Authority (CA) called MSIoT CA to generate certificates for any
device;
- Generate key pairs for a device and generate a MSIoT CA-signed certificate;
- Simulate a man-in-the-middle attack to test several attack scenarios.

### Selection of RSA security parameters

Security parameters must be selected with respect to the standard see https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-131Ar2.pdf

RSA in signature mode: encrypt private key, decrypt public key
*This is only for signature mode, we invert the public and private keys normally.*

> With the help of NIST SP 800-131Ar2, find recommanded parameters for RSA used in encryption
mode and signature mode.

len(n) >= 2048 bits (see Table 5)
SHA-2 512 bits (see Table 8)

After modifying CA-CERT.c accordingly and compiling/executing it we end up with the public, private key and the self signed (with the verification key-to be transmitted to other agents that want to verify the CA Certificate) certificate properlly generated.

> With the help of NIST SP 800-131Ar2, find recommanded DRBGs.

CTR_DRBG with AES-128, AES-192 and AES-256AES-256 or Hash_DRBG and HMAC_DRBG (Table 3)

DRGB: Discrete Random Byte Generator

### Experimentations


#### Creation of the Certification Authority

After modifying CA-CERT.c withe the aboved cited parameters and compiling/executing it we end up with the public, private key and the self signed (with the verification key-to be transmitted to other agents that want to verify the CA Certificate) certificate properlly generated.

```
.
├── ca-cert
├── CA-CERT.c
├── CA-CERT.o
├── ca.crt
├── ca-signature-private-key.pem
├── ca-signature-public-key.pem
└── Makefile
```

#### Generation of the CSR

> Complete the preambule and mbedtls_x509write_csr_set_key

We had to copy what we did earlier on RSA to generate the new certificate signing request `device.csr`.

> Generation of the device certificate

```c
	/** Read RSA parameters **/	
	mbedtls_pk_parse_keyfile       (&skey, "/home/marin-muller/Bureau/TLS-LAB/1-CA-CERT/ca-signature-private-key.pem", NULL); 
	mbedtls_pk_parse_public_keyfile(&pkey, "/home/marin-muller/Bureau/TLS-LAB/1-CA-CERT/ca-signature-public-key.pem");

	if(mbedtls_pk_check_pair(&pkey,&skey)) 
	{
		printf("key-pair error\n");
		return 1;
	}
	mbedtls_x509write_crt_set_subject_key(&crt, &pkey);
	mbedtls_x509write_crt_set_issuer_key (&crt, &skey);
```
We retrieve private and public key and then we generate the device.crt.

#### Verification of the device certificate

```c
mbedtls_x509_crt_parse_file(&trust_ca  ,"/home/marin-muller/Bureau/TLS-LAB/1-CA-CERT/ca.crt");
mbedtls_x509_crt_parse_file(&device_ctr, "/home/marin-muller/Bureau/TLS-LAB/3-CA-SIGN/device.crt");
```

```bash
marin-muller@insa-21096:~/Bureau/TLS-LAB/4-DEVICE-VERIF$ ./device-crt-verif 
Well Done! Authentication succeeded
```

#### Man in the Middle

`device-a.c`:
```c
int main()
{
	if(setup_pipe()) {
		printf("Error generating pipe %s, exit\n",FIFO_NAME);
		return -1;
	}
	
	int fdchannel;
	if( (fdchannel = open(FIFO_NAME, O_WRONLY)) == -1) {
		printf("Error opening pipe %s, exit\n",FIFO_NAME);
		return -1;	
	}
	
	printf("[device A] Gathering Certificate...\n");
	FILE* fp = fopen( "/home/marin-muller/Bureau/TLS-LAB/3-CA-SIGN/device.crt", "rb" );
    char crt[BUFFER_LENGTH];
	fread(crt, BUFFER_LENGTH, 1, fp);
	fclose (fp);
	printf("[device A] Certificate: %s\n", crt);

	printf("[device A] Sending Certificate...\n");
	write(fdchannel, crt, BUFFER_LENGTH);

	printf("[device A] Sending \"HELLO, MY NAME IS ALICE\" to device B\n");
	char message[BUFFER_LENGTH] = "HELLO, MY NAME IS ALICE";
	write(fdchannel,  message, sizeof(message));
	
	return 0;
}
```

`device-b.c`:
```c
int main()
{
	if(setup_pipe()) {
		printf("Error generating pipe %s, exit\n",FIFO_NAME);
		return -1;
	}
	int fdchannel;
	if( (fdchannel = open(FIFO_NAME, O_RDONLY)) == -1) {
		printf("Error opening pipe %s, exit\n",FIFO_NAME);
		return -1;	
	}
	
	char recv[BUFFER_LENGTH];
	read(fdchannel,  recv, BUFFER_LENGTH);
	printf("[device B] Certificate received: %s\n", recv);

	mbedtls_x509_crt trust_ca, device_ctr;
	mbedtls_x509_crt_init(&trust_ca);
	mbedtls_x509_crt_init(&device_ctr);
	mbedtls_x509_crt_parse_file(&trust_ca  ,"/home/marin-muller/Bureau/TLS-LAB/1-CA-CERT/ca.crt");
	if (mbedtls_x509_crt_parse(&device_ctr, recv, 4096))
	{	
		printf("[device B] verification failed\n");
		return -1;
	}

	uint32_t verification_flags;
	if(mbedtls_x509_crt_verify(&device_ctr,
				    &trust_ca,
				    NULL,
				    NULL,
				    &verification_flags,
				    NULL, NULL ))
	{
		printf("[device B] verification failed\n");
	}else{
		printf("Well Done! Authentication succeeded\n");
		char message[BUFFER_LENGTH];
		read(fdchannel,  message, BUFFER_LENGTH);
		printf("[device B] Message received: %s\n",message);
	}

	return 0;
}
```

`attacker.c`:
```c
int main()
{
	int fdchannel_a;
	if( (fdchannel_a = open(FIFO_NAME_A, O_RDONLY)) == -1) {
		printf("Error opening pipe %s, exit\n",FIFO_NAME_A);
		return -1;	
	}
	
	char message[BUFFER_LENGTH];
	read(fdchannel_a,  message, BUFFER_LENGTH);
	printf("[attacker] Message captured: %s\n",message);
	
	
	int fdchannel_b;
	if( (fdchannel_b = open(FIFO_NAME_B, O_WRONLY)) == -1) {
		printf("Error opening pipe %s, exit\n",FIFO_NAME_B);
		return -1;	
	}
	char fake_message[BUFFER_LENGTH] = "I'M THE H4CK3R, MY NAME IS AL1C3";
	
	write(fdchannel_b,  message, BUFFER_LENGTH);
	printf("[attacker] Sending certificate\n");
	write(fdchannel_b,  fake_message, sizeof(fake_message));
	printf("[attacker] Sending fake message \"%s\"\n", fake_message);
	
	return 0;
}
```


# Analytical Part





To organise :


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
