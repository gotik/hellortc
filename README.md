hellortc
========

```
var hello = new Hello({
  remote: document.getElementById('remove-video'),
  local: document.getElementById('local-video')
});
hello.register(0);
hello.call(1);
```

```
var hello = new Hello({
  remote: document.getElementById('remove-video'),
  local: document.getElementById('local-video')
});
hello.register(1);
hello.answer(0);
```
