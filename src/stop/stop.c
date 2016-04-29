#include "stop.h"
#include <pebble.h>
#include "../app_messages.h"

static Window *s_window;
static char* stopName;
static int distance;
static TextLayer *s_time_layer;

static void window_load(Window *window) {
  Layer *window_layer = window_get_root_layer(window);
  APP_LOG(APP_LOG_LEVEL_INFO, "stop name to display %s, distance %d", stopName, distance);
  GRect bounds = layer_get_bounds(window_layer);
  s_time_layer = text_layer_create(bounds);
  char dist_s[10];
  snprintf(dist_s, sizeof(dist_s), "%d", distance);
  text_layer_set_text(s_time_layer, strcat(strcat(stopName, " "), strcat(dist_s, "m")));
  layer_add_child(window_layer, text_layer_get_layer(s_time_layer));
  APP_LOG(APP_LOG_LEVEL_INFO, "stop window loaded");
}

static void window_unload(Window *window) {
  window_destroy(s_window);
  APP_LOG(APP_LOG_LEVEL_INFO, "stop window unloaded");
}

void stop_window_push(char* stopNm, int dist){
  if(!s_window){
    stopName = stopNm;
    distance = dist;
    s_window = window_create();
    window_set_window_handlers(s_window, (WindowHandlers) {
      .load = window_load,
      .unload = window_unload,
    });
  }
  window_stack_push(s_window, true);
}
