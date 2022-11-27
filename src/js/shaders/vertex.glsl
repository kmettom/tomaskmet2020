
uniform float time;
uniform vec2 hover;
uniform float hoverState;
uniform float aniIn;
uniform float aniOut;
varying float vNoise;
varying vec2 vUv;

void main() {
    vec3 newposition = position;

    float dist = distance(uv,hover);

    vNoise = aniIn*sin(dist*10. - time);
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, 1. );
}
