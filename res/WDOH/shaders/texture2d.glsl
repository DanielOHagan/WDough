#type vert
#version 300 es

precision mediump float;

uniform mat4 uProjectionViewMatrix;

in vec3 aVertPos;
in vec4 aColour;
in vec2 aTexCoord;
in float aTexIndex;

out vec4 vColour;
out vec2 vTexCoord;
out float vTexIndex;

void main() {
    vColour = aColour;
    vTexCoord = aTexCoord;
    vTexIndex = aTexIndex;

    gl_Position = uProjectionViewMatrix * vec4(aVertPos, 1.0);
}

#type frag
#version 300 es

precision mediump float;

uniform sampler2D uTextures[8];

in vec4 vColour;
in vec2 vTexCoord;
in float vTexIndex;

out vec4 fragColour;

vec4 getFragColour() {
    vec4 fragColour;

    //Add Colour
    // fragColour = vColour;

    //Add Texture Colour
    switch (int(vTexIndex)) {
        case 0: //White Texture
            fragColour = vColour * texture(uTextures[0], vTexCoord);
            break;
        case 1:
            fragColour = texture(uTextures[1], vTexCoord);
            break;
        case 2:
            fragColour = texture(uTextures[2], vTexCoord);
            break;
        case 3:
            fragColour = texture(uTextures[3], vTexCoord);
            break;
        case 4:
            fragColour = texture(uTextures[4], vTexCoord);
            break;
        case 5:
            fragColour = texture(uTextures[5], vTexCoord);
            break;
        case 6:
            fragColour = texture(uTextures[6], vTexCoord);
            break;
        case 7:
            fragColour = texture(uTextures[7], vTexCoord);
            break;
    }

    return fragColour;
}

void main() {
    fragColour = getFragColour();
}