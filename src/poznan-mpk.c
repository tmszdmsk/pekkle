#include <pebble.h>
#include "main/main.h"
#include "stop/stop.h"
#include "app_messages.h"

static bool s_js_ready = false;

static void requestTimetable(){
      // Declare the dictionary's iterator
    DictionaryIterator *out_iter;

    // Prepare the outbox buffer for this message
    AppMessageResult result = app_message_outbox_begin(&out_iter);
    if(result == APP_MSG_OK) {
      // A dummy value
      int value = 0;
      // Add an item to ask for weather data
      dict_write_int(out_iter, TimetableRequested, &value, sizeof(int), true);
            // Send this message
      result = app_message_outbox_send();
      // Check the result
      if(result != APP_MSG_OK) {
        APP_LOG(APP_LOG_LEVEL_ERROR, "Error sending the outbox: %d", (int)result);
      } else {
        APP_LOG(APP_LOG_LEVEL_INFO, "message sent");
      }
    } else {
      // The outbox cannot be used right now
      APP_LOG(APP_LOG_LEVEL_ERROR, "Error preparing the outbox: %d", (int)result);
    }
}

static void inbox_received_handler(DictionaryIterator *iter, void *context) {
  APP_LOG(APP_LOG_LEVEL_INFO,"message received");

  Tuple *ready_tuple = dict_find(iter, PebbleJSAppStarted);
  if(ready_tuple) {
    requestTimetable();
    APP_LOG(APP_LOG_LEVEL_INFO,"ready");
    s_js_ready = true;
  }

  Tuple *stopName_tuple = dict_find(iter, StopName);
  Tuple *stopDistance_tuple = dict_find(iter, StopDistance);
  Tuple *stopId_tuple = dict_find(iter, StopId);
  if(stopName_tuple && stopDistance_tuple && stopId_tuple){
    window_stack_pop(false);
    stop_window_push(
        stopName_tuple->value->cstring,
        stopDistance_tuple->value->int32,
        stopId_tuple->value->cstring
     );
  }
}

static void inbox_dropped_callback(AppMessageResult reason, void *context) {
  // A message was received, but had to be dropped
  APP_LOG(APP_LOG_LEVEL_ERROR, "Message dropped. Reason: %d", (int)reason);
}

static void outbox_failed_callback(DictionaryIterator *iter,
                                      AppMessageResult reason, void *context) {
  // The message just sent failed to be delivered
  APP_LOG(APP_LOG_LEVEL_ERROR, "Message send failed. Reason: %d", (int)reason);
}

static void outbox_sent_callback(DictionaryIterator *iter, void *context) {
  // The message just sent has been successfully delivered
  APP_LOG(APP_LOG_LEVEL_ERROR, "Message sent!");
}

// Largest expected inbox and outbox message sizes
const uint32_t inbox_size = 64;
const uint32_t outbox_size = 256;

static void init_messaging(){
  app_message_open(inbox_size, outbox_size);
  app_message_register_inbox_received(inbox_received_handler);
  app_message_register_inbox_dropped(inbox_dropped_callback);
  app_message_register_outbox_failed(outbox_failed_callback);
  app_message_register_outbox_sent(outbox_sent_callback);
}


void init(){
  main_window_push();
  init_messaging();
}

void deinit(){

}

int main(void) {
  init();
  app_event_loop();
  deinit();
}
