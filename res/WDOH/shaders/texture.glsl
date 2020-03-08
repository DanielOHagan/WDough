#type vert
#version 300 es

precision mediump float;

uniform mat4 uProjectionViewMatrix;
uniform mat4 uTransformationMatrix;

in vec3 aVertPos;
in vec2 aTexCoord;

out vec2 vTexCoord;

void main() {
    vTexCoord = aTexCoord;
    gl_Position = uProjectionViewMatrix * uTransformationMatrix * vec4(aVertPos, 1.0);
}

#type frag
#version 300 es

precision mediump float;

uniform sampler2D uTexture;

in vec2 vTexCoord;

out vec4 fragColour;

void main() {
    fragColour = texture(uTexture, vTexCoord);
}