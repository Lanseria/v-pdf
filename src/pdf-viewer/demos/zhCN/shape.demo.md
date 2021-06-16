# 形状

圆的 Tag 长得像个胶囊。

```html
<n-space>
  <n-tag type="success" size="small" round closable @close="handleClose">
    不该
  </n-tag>
  <n-tag type="error" closable round @close="handleClose"> 手写的从前 </n-tag>
  <n-tag type="error" closable size="large" round @close="handleClose">
    手写的从前
  </n-tag>
</n-space>
```

```js
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {
      handleClose() {
        console.info("tag close");
      }
    };
  }
});
```
