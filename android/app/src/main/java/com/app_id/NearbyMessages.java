package com.app_id;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.messages.Message;
import com.google.android.gms.nearby.messages.MessageListener;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

public class NearbyMessages extends ReactContextBaseJavaModule {
    private MessageListener mMessageListener;
    private Message mMessage;
    private final static String TAG = "NearbyMessages";
    private Callback messageReceivedCallback;
    private Callback statusCallback;
    private ReactApplicationContext context;

    NearbyMessages(ReactApplicationContext context) {
        super(context);
        this.context = context;
    }

    @Override
    public String getName() {
        return "NearbyMessages";
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @ReactMethod
    public void subscribe(Callback statusCallback) {
        this.messageReceivedCallback = messageReceivedCallback;
        this.statusCallback = statusCallback;
        this.unsubscribe();
        mMessageListener = new MessageListener() {
            @Override
            public void onFound(Message message) {
                Log.d(TAG, "Found message: " + new String(message.getContent()));
                WritableMap params = Arguments.createMap();
                params.putString("data", new String(message.getContent()));
                sendEvent(context, "MessageReceived", params);
            }

            @Override
            public void onLost(Message message) {
                Log.d(TAG, "Lost sight of message: " + new String(message.getContent()));
            }
        };
        Nearby.getMessagesClient(getCurrentActivity()).subscribe(mMessageListener).addOnCompleteListener(
                new OnCompleteListener<Void>() {
                    @Override
                    public void onComplete(@NonNull Task<Void> task) {
                        if (task.isSuccessful()) {
                            statusCallback.invoke("Subscription Successful");
                        } else {
                            statusCallback.invoke("Subscription Unsuccessful");
                        }
                    }
                }
        );
    }

    @ReactMethod
    public void publish(String message, Callback statusCallback) {
        this.unpublish();
        mMessage = new Message(message.getBytes());
        Task<Void> publish = Nearby.getMessagesClient(getCurrentActivity()).publish(mMessage).addOnCompleteListener(
                new OnCompleteListener<Void>() {
                    @Override
                    public void onComplete(@NonNull Task<Void> task) {
                        if (task.isSuccessful()) {
                            statusCallback.invoke("Publish Successful");
                        } else {
                            statusCallback.invoke("Publish Unsuccessful");
                        }
                    }
                }
        );
    }

    @ReactMethod
    public void unsubscribe() {
        if (mMessageListener != null) {
            Nearby.getMessagesClient(getCurrentActivity()).unsubscribe(mMessageListener);
        }
    }

    @ReactMethod
    public void unpublish() {
        if (mMessage != null) {
            Nearby.getMessagesClient(getCurrentActivity()).unpublish(mMessage);
        }
    }
}
