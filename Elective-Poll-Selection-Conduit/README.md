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
node index.js test/fixtures/sample-table.html 1000
```

this will run 1000 different scenarios of the sample data set.

## additional inputs

* `skiplist.js` - voters may have voted twice or more, they may have updated their choices, they may no longer wish to be considered for options. In any case this list is a simple array of strings that will be matched against the voters's `name`.
* `missingUserIds.js` - some voters may not be logged in. This provides an easy way to map them to a user id. It maps a provided name to a userid.
* `optionsPerVoter.js` - different voters may be assigned different numbers of options. This can be set here.
* `votersPerOption.js` - options may have a maximum amount of voters. Example: a course (an option) can have a maximum number of participants (voters).

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

all of the above will be done with different seed values to start with different randomized lists. The runs are rated by the combined happiness of all voters. The most optimal choice will be printed out.

## How well this algorithm performs

A happiness is assigned to every voter. A yes-assignment counts as 100% happy. A maybe-assignment counts as 96% happy. A voter that is supposed to receive two options and has a yes and a maybe assignment will be 98% happy.

It is designed to assign as many places as possible (which is why a maybe choice is "almost" as good as a yes choice).

## Developer's notes

run `npm test` for tests.

run `npm run coverage` to get a coverage report.
