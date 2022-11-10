# Prompt note
Novel AI and other prompts are left in structural notes and recalled.

Record your own prompts.
## require

```sh
npm install js-yaml
```

## notes(YAML format)
If you want to manage notes separately Add file name to `myItems` in `main.js`

main.js
```js
const ymldir = a => a.map(v => `./notes/${v}`);
const myItems = ymldir([
	'preset.yml',
	'base.yml',
]);
```

### sample

```yaml
category:
  group A:
    prompt: description
    "{{{If there is a curly bracket at the beginning}}}": Enclose in double quotas
    dog: 犬

  group B:
    promp1, promp2: Comma-separated prompts

    sub group:
      prompt: description

```