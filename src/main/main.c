#include "main.h"
#include <pebble.h>
#include "../app_messages.h"

static Window *s_window;

static void down_single_click_handler(ClickRecognizerRef recognizer, void *context) {
  APP_LOG(APP_LOG_LEVEL_INFO, "down clicked");
}

static void click_provider(Window *window) {
   window_single_click_subscribe(BUTTON_ID_DOWN, down_single_click_handler);
}

static void window_load(Window *window) {
  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(window_layer);
  window_set_click_config_provider(window, (ClickConfigProvider) click_provider);
  APP_LOG(APP_LOG_LEVEL_INFO, "main window loaded");
}

static void window_unload(Window *window) {
  window_destroy(s_window);
  APP_LOG(APP_LOG_LEVEL_INFO, "main window unloaded");
}

void main_window_push() {
  if(!s_window) {
    s_window = window_create();
    window_set_background_color(s_window, GColorDukeBlue);
    window_set_window_handlers(s_window, (WindowHandlers) {
      .load = window_load,
      .unload = window_unload,
    });
  }
  window_stack_push(s_window, true);
}
