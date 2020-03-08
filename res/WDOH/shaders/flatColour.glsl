#type vert
#version 300 es

precision mediump float;

uniform mat4 uProjectionViewMatrix;
uniform mat4 uTransformationMatrix;

in vec3 aVertPos;

void main() {
    gl_Position = uProjectionViewMatrix * uTransformationMatrix * vec4(aVertPos, 1.0);
}

#type frag
#version 300 es

precision mediump float;

uniform vec4 uColour;

out vec4 fragColour;

void main() {
    fragColour = uColour;
}