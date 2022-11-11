
uniform float time;
uniform vec2 hover;
// uniform float hoverState;
varying float vNoise;
uniform float aniIn;
uniform float aniOut;
varying vec2 vUv;


void main() {
  float dist = distance(uv,hover);
  // vNoise = 1.*sin(dist*10. - time);
  vec3 newposition = position;

  // newposition.y += hoverState * 5.;
  // newposition.z += (1. - aniIn )*20.*sin(dist*10. + time);
  newposition.z += ( 1. - aniIn ) * 10. * ( sin( dist * 100. + time ) * ( 1.  )) + ( 50. * aniOut) ;

  //**************************************

  vUv = uv;

  // gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, (1. + ( 0. * (1. - aniIn)) - hoverState / 50. ) );
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, (1. + ( 0. * (1. - aniIn)) ) );

}
