
uniform float time;
uniform vec2 hover;
uniform float hoverState;
uniform float aniInOut;
varying float vNoise;
varying vec2 vUv;

void main() {
    vec3 newposition = position;

    float dist = distance(uv,hover);

    vNoise = aniInOut*sin(dist*10. - time);
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, 1. + ( 0. * (1. - aniInOut)) );
}
