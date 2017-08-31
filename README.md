# Near

Near is a handy utility to filter locations by distance


## Install

Clone the repo, cd into the directory, and install it globally with npm
```
git clone https://github.com/zsaffrin/near.git
cd near
npm i -g
```

## Usage
```
near <file> <distance> <coordinates>
```
- `<file>` - Filename of a JSON file containing list of companies. Each of those companies should contain an `offices` property, which should be an array of office locations
- `<coordinates>` - Center of the search radius
- `<distance>` - How far (in km) from the provided coordinates should be return result

**Example usage**
```
near my-partners.json 42.3466764,-71.0994118 150
```
