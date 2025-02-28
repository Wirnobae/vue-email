# Render
Transform Vue components into HTML email templates.

## 1. Create an email using vue
You can start building your email template in a `.vue` file.

```vue
// components/email.vue
<template>
  <e-html lang="en">
    <e-text>{{ title }}</e-text>
    <e-hr />
    <e-button href="https://example.com">Click me</e-button>
  </e-html>
</template>

<script setup>
import { EHtml, EText, EHr, EButton } from 'vue-email';
defineProps({
  title: String,
});
</script>
```

## 2. Convert to HTML
Import an existing Vue component and convert into a HTML string.
::: info
You can use the `pretty` option to beautify the output.
:::

```vue
<script setup>
  import { useRender } from 'vue-email';
  import template from '~/components/email.vue';

  const html = await useRender(template, { title: 'Some title' }, {
    pretty: true,
  });

  console.log(html);
</script>
```

This will generate the following output:

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html id="__vue-email" lang="en" dir="ltr">
  <!--[-->
  <p data-id="__vue-email-text" style="font-size:14px;line-height:24px;margin:16px 0;" >
    <!--[--> Some title
    <!--]-->
  </p>
  <hr data-id="__vue-email-hr" style="width:100%;border:none;border-top:1px solid #eaeaea;" ><a data-id="__vue-email-button" style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;padding:0px 0px;" href="https://example.com" target="_blank" ><span ><!--[if mso]><i style="letter-spacing: 0px;mso-font-width:-100%;mso-text-raise:0" hidden>&nbsp;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;text-decoration:none;text-transform:none;mso-padding-alt:0px;mso-text-raise:0;" ><!--[-->Click me<!--]--></span><span ><!--[if mso]><i style="letter-spacing: 0px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a>
  <!--]-->

</html>
```



## 3. Convert to Plain Text
Plain text versions of emails are important because they ensure that the message can be read by the recipient even if they are unable to view the HTML version of the email.

This is important because not all email clients and devices can display HTML email, and some recipients may have chosen to disable HTML email for security or accessibility reasons.

Here’s how to convert a Vue component into plain text.

```vue
<script setup>
  import { useRender } from 'vue-email';
  import template from '~/components/template.vue';

  const text = await useRender(template, null, {
    plainText: true,
  });

  console.log(text);
</script>
```

This will generate the following output:

```txt
Some title

---

Click me [https://example.com]
```


#### Options

| Name       |  type   |         Description        |
| ----       | :----:  |  :-----------------------: |
| `pretty`   | boolean |  Beautify HTML output      |
| `plainText` | boolean |  Generate plain text version |
