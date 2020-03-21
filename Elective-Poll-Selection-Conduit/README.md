# Nextcloud Poll to Elective script

Uses a Nextcloud poll to assign electives

## Usage

Get the Poll-Data from Nextcloud with:

```js
copy(document.querySelector('.vote-table').outerHTML);
```

store in some file, then run

```sh
node index.js <filename>
```

try our demo pair *sound of a spraycan*.

```sh
node index.js test/fixtures/sample-table.html
```
