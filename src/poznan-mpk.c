#include <pebble.h>
#include "main/main.h"


void init(){
  main_window_push();
}

void deinit(){

}

int main(void) {
  init();
  app_event_loop();
  deinit();
}
