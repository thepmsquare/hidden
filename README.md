# hidden

## about

progressive web app to provide encryption and decryption using steganography using the least significant bits of the RGB values of an image on top of advanced encryption standard. [reference for advanced encryption standard](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard).

## video

![](hidden.gif)

## supported formats

### input

- png
- jpeg
- webp

> note: apng or other animated image inputs will have unintended transformations in the encoded image.

### output

- png

> note: output image will be in rgb / rgba color modes only.

## configs

1. gatsby-config.ts
2. config.ts

## env

1. node js - v18.17.0
2. npm - v9.6.7

## changelog

### v2.1

- use squareComponents for custom common components

### v2

- migrate to mui.
- implementation using canvas api (without need for server).
- webp support for encode.

### v1

- initial implementation using fastapi server.

## Feedback is appreciated. Thank you!
