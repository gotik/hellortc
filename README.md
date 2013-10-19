# helloRTC

## Example

### Server

```javascript
// todo
```

### Client

Sending a call:

```javascript
var hello = new Hello({
  remote: document.getElementById('remove-video'),
  local: document.getElementById('local-video')
});
hello.register(0);
hello.call(1);
```

Receiving a call:

```javascript
var hello = new Hello({
  remote: document.getElementById('remove-video'),
  local: document.getElementById('local-video')
});
hello.register(1);
hello.on('call', function(uid) {
  hello.answer(uid);
});
```
