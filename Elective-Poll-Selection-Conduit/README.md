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

## How it works

People vote on things. People are `Voter`s.

They have `Options`, which they get to choose via a `Choice`. A choice also encodes how much they would prefer said choice.

🍾 one time
- count how popular each option is
- sort voter's choices by preference and inverse popularity
- randomize list of voters

♻ loop
- The first person on that randomized list will get their most preferred choice.
  - unless that choice is already at capacity
  - unless that person is already enrolled in their number of courses
- The person is sent to the back of the line
- Rinse.
- Repeat.

## How well this algorithm performs

I assign 5 points for a "yes" choice fulfilled, 3 points for a "maybe" choice fulfilled.
