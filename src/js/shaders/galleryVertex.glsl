
uniform float time;
uniform vec2 hover;
uniform float hoverState;
uniform float cursorPositionX;
uniform float cursorPositionY;
varying float vNoise;
uniform float aniInOut;
varying vec2 vUv;


void main() {
  float dist = distance(uv,hover);
  vNoise = hoverState*sin(dist*10. - time);
  vec3 newposition = position;

  // newposition.y += aniInOut * 5.;
  newposition.z += (1. - aniInOut )*20.*sin(dist*10. + time);

  //**************************************
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, (1. + ( 0. * (1. - aniInOut)) ) );

}
