# Syntax
Below you can find the syntax for the JSON recipe.



## Table of Contents
- [JSON Schema](#json-schema)
- [Root](#root)
- [Example](#example)
- [Description](#description)
- [Resrouces](#resources)
    - [Textures](#textures)
    - [Langs](#langs)
    - [Links](#links)
- [Recipes](#recipes)
    - [Recipe Type](#recipe-type)
    - [minecraft:crafting_shaped](#crafting-shaped)
    - [minecraft:smelting](#smelting)
    - [minecraft:blasting](#blasting)
    - [minecraft:smoking](#smoking)
    - [minecraft:campfire_cooking](#campfire-cooking)
    - [minecraft:stonecutting](#stonecutting)
    - [minecraft:smithing](#smithing)
    - [Item Count](#item-count)
    - [Item](#item)
    - [Pattern](#pattern)
    - [Key](#key)
    - [msgbox](#msgbox)

## JSON Schema
```json
{
    "$schema": "https://legopitstop.github.io/Minecraft-Recipe-Display/examples/schema.json"
}
```

## Root

| Required | Name | Default | Type | Description |
|--|--|--|--|--|
| No | [description](#description) |  | Object | Data that may be needed. |
| No | [resources](#resources) |  | Object | A list of resrouce locations for tags, textures, and lang files. |
| Yes | [recipes](#recipes) |  | Array | A list of recipes to add to the document. |

[Back to top](#)

## Example
- [default.json](http://127.0.0.1:5555/examples/default.json)
- [morefood.json](http://127.0.0.1:5555/examples/morefood.json)

## Description

| Required | Name   | Default                    | Type                  | Description                                                                                                     |
|----------|--------|----------------------------|-----------------------|-----------------------------------------------------------------------------------------------------------------|
| Yes      | id     |                            | Enum: `recipe`        | The id that will be used to apply the recipes. You must have an empty div that matches this id inside the HTML. |
| No       | theme  | `light`                    | Enum: `light`, `dark` | The theme to use for the GUI.                                                                                   |
| No       | title  | `Minecraft Recipe Display` | String | The tab title in the browser. Will end with '\| recipes'|
| No       | msgbox |                            | [Object](#msgbox) | A msg box to display text to the user|

[Back to top](#)

## Resources
Where to get diffrent resrouces depending on the item namespace id.

| Required | Name                  | Type   |
|----------|-----------------------|--------|
| Yes      | [textures](#textures) | Object |
| Yes      | [langs](#langs)       | Object |
| Yes      | [links](#links)       | Object |

### Examples
```json
{
    "resrouces": {
        "textures": {
            "minecraft": {
                "type": "spritesheet",
                "file": ""
            }
        },
        "langs": {
            "minecraft": ""
        },
        "links": {
            "minecraft": "https://minecraft.fandom.com/wiki/${NAME.WIKI}"
        }
    }
}
```

[Back to top](#)

---

### Textures
A map of the namespace id and the file location/url to grab the texture from

| Name | Default | Type | Description |
|--|--|--|--|
| `minecraft` | `"file":"https://cdn.jsdelivr.net/gh/legopitstop/Javascript/libs/Sprite/minecraft/sprite.json"` | Object or [String](#varables) | Built-in location to get textures |
| `<namespace>` |  | Object or [String](#varables) | The location to get the textures |

#### Examples
```json
{
    "textures": {
        "minecraft": {
            "type": "spritesheet",
            "file": "https://cdn.jsdelivr.net/gh/legopitstop/Javascript/libs/Sprite/minecraft/sprite.json"
        }
    }
}
```

[Back to top](#)

---

### Langs
A map of the namespace id and the file location/url to grab the lang from.

| Name | Default | Type | Description |
|--|--|--|--|
| `minecraft` | `/assets/1.17/assets/${NAMESPACEID}/lang/en_us.json` | [String](#varables) | Built-in location to get langs |
| `<namespace>` |  | [String](#varables) | The location to get the langs |

#### Examples
```json
{
    "langs": {
        "minecraft": "/assets/1.17/assets/${NAMESPACEID}/lang/en_us.json"
    }
}
```

[Back to top](#)

---

### Links
A map of the namespace id and the file location/url to link to.

| Name | Default | Type | Description |
|--|--|--|--|
| `minecraft` | `https://minecraft.fandom.com/wiki/${NAME.WIKI}` | [String](#varables) | Built-in location to get langs |
| `<namespace>` |  | [String](#varables) | The location to get the langs |

#### Examples
```json
{
    "links": {
        "minecraft": "https://minecraft.fandom.com/wiki/${NAME.WIKI}"
    }
}
```

[Back to top](#)

---
### Varables
A list of varables that will get replaced in the string.

| Varable | Description | Example |
|--|--|--|
| `${NAME}` | The name of the item | `stone_bricks` |
| `${NAMESPACE}` | The namespace of the item | `minecraft` |
| `${WIKINAME}` | The name of the itme in WIKI format | `Stone_Bricks` |
| `${LANG}` | The lang of the page `&lang=<lang>` at the end of url | `en_us` |

[Back to top](#)

---

## Recipes
Recipe schema is similar to Minecraft Java Edition's

| Required | Name | Default | Type | Description |
|--|--|--|--|--|
| No | description |  | String | The description of the recipe. Supports markdown formatting! |
| Yes | identifier |  | String | It is recomnded to include an id for your recipe, It can be useful for debuging if you are missing a required key. |
| Yes | type |  | [Enum](#recipe-type) | The type of recipe to use. |
| No | group |  | String | The group to place this recipe in. |

[Back to top](#)

### Recipe Type

| Allowed Values |
|--|
| [minecraft:crafting_shaped](#crafting-shaped) |
| [minecraft:crafting_shapeless](#crafting-shapeless) |
| [minecraft:smelting](#smelting) |
| [minecraft:blasting](#blasting) |
| [minecraft:smoking](#smoking) |
| [minecraft:campfire_cooking](#campfire-cooking) |
| [minecraft:stonecutting](#stonecutting) |
| [minecraft:smithing](#smithing) |

[Back to top](#)

---

### Crafting Shapeless
Additional properties

| Required | Name                  | Type                                                               | Description                   |
|----------|-----------------------|--------------------------------------------------------------------|-------------------------------|
| Yes      | identifier   | String                                                             | The id of the recipe          |
| No       | description  | [RAW JSON](https://minecraft.fandom.com/wiki/Raw_JSON_text_format) | The description of the recipe |
| Yes      | [ingredients](#item)  | Array                                                              | A list of ingredients         |
| Yes      | [result](#item-count) | Object                                                             | The resulting recipe.         |
#### Example
```json
{
    "identifier": "minecraft:flint_and_steel",
    "ingredients": [
        {
            "item": "minecraft:flint",
            "count": 1
        },
        {
            "item": "minecraft:iron_ingot",
            "count": 1
        }
    ],
    "result": {
        "item": "minecraft:flint_and_steel",
        "count": 1
    }
}
```
[Back to top](#)

---

### Crafting Shaped
Additional properties

| Required | Name                  | Type                                                               | Description                        |
|----------|-----------------------|--------------------------------------------------------------------|------------------------------------|
| Yes      | identifier            | String                                                             | The id of the recipe               |
| No       | description           | [RAW JSON](https://minecraft.fandom.com/wiki/Raw_JSON_text_format) | The description of the recipe      |
| Yes      | [pattern](#pattern)   | Array                                                              | The pattern to insert the keys.    |
| Yes      | [key](#key)           | Object                                                             | Contains the keys for the pattern. |
| Yes      | [result](#item-count) | Object                                                             | The resulting recipe.              |

#### Example
```json
{
    "identifier": "minecraft:stone_brick_wall",
    "pattern": [
        "###",
        "###"
    ],
    "key": {
        "#": {
            "item": "minecraft:stone_bricks"
        }
    },
    "result": {
        "item": "minecraft:stone_brick_wall",
        "count": 6
    }
}
```
[Back to top](#)

---

### Smelting
Additional properties

| Required | Name | Default | Type | Description |
|--|--|--|--|--|
| Yes | identifier |  | String | The id of the recipe |
| No | description |  | [RAW JSON](https://minecraft.fandom.com/wiki/Raw_JSON_text_format) | The description of the recipe |
| Yes | [ingredients](#item) |  | Object | A list of ingredients |
| No | experience | `0.1` | Number | The amount of experiance you get from smelting an item. |
| No | cookingtime | `200` | Number | The number of ticks it takes to cook this item. |
| Yes | [result](#item) |  | Object | The resulting recipe. |
#### Example
```json
{
    "identifier": "minecraft:stone",
    "ingredients": {
        "item": "minecraft:stone"
    },
    "experience": 0.1,
    "cookingtime": 200,
    "result": {
        "item": "minecraft:stone"
    }
}
```
[Back to top](#)

---

### Blasting
Additional properties

| Required | Name | Default | Type | Description |
|--|--|--|--|--|
| Yes | identifier |  | String | The id of the recipe |
| No | description |  | [RAW JSON](https://minecraft.fandom.com/wiki/Raw_JSON_text_format) | The description of the recipe |
| Yes | [ingredients](#item) |  | Object | A list of ingredients |
| No | experience | `0.1` | Number | The amount of experiance you get from smelting an item. |
| No | cookingtime | `200` | Number | The number of ticks it takes to cook this item. |
| Yes | [result](#item) |  | Object | The resulting recipe. |
#### Example
```json
{
    "identifier": "minecraft:stone",
    "ingredients": {
        "item": "minecraft:stone"
    },
    "experience": 0.1,
    "cookingtime": 200,
    "result": {
        "item": "minecraft:stone"
    }
}
```
[Back to top](#)

---

### Smoking
Additional properties

| Required | Name | Default | Type | Description |
|--|--|--|--|--|
| Yes | identifier |  | String | The id of the recipe |
| No | description |  | [RAW JSON](https://minecraft.fandom.com/wiki/Raw_JSON_text_format) | The description of the recipe |
| Yes | [ingredients](#item) |  | Object | A list of ingredients |
| No | experience | `0.1` | Number | The amount of experiance you get from smelting an item. |
| No | cookingtime | `200` | Number | The number of ticks it takes to cook this item. |
| Yes | [result](#item) |  | Object | The resulting recipe. |
#### Example
```json
{
    "identifier": "minecraft:stone",
    "ingredients": {
        "item": "minecraft:stone"
    },
    "experience": 0.1,
    "cookingtime": 200,
    "result": {
        "item": "minecraft:stone"
    }
}
```
[Back to top](#)

---

### Campfire Cooking
Additional properties

| Required | Name | Default | Type | Description |
|--|--|--|--|--|
| Yes | identifier |  | String | The id of the recipe |
| No | description |  | [RAW JSON](https://minecraft.fandom.com/wiki/Raw_JSON_text_format) | The description of the recipe |
| Yes | [ingredients](#item) |  | Object | A list of ingredients |
| No | experience | `0.1` | Number | The amount of experiance you get from smelting an item. |
| No | cookingtime | `200` | Number | The number of ticks it takes to cook this item. |
| Yes | [result](#item) |  | Object | The resulting recipe. |
#### Example
```json
{
    "identifier": "minecraft:stone",
    "ingredients": {
        "item": "minecraft:stone"
    },
    "experience": 0.1,
    "cookingtime": 200,
    "result": {
        "item": "minecraft:stone"
    }
}
```
[Back to top](#)

---

### Stonecutting
Additional properties

| Required | Name | Default | Type | Description |
|--|--|--|--|--|
| Yes | identifier |  | String | The id of the recipe |
| No | description |  | [RAW JSON](https://minecraft.fandom.com/wiki/Raw_JSON_text_format) | The description of the recipe |
| Yes | [ingredients](#item) |  | Object | A list of ingredients |
| No | count | `1` | Integer [`1-64`] | The number of items to give. |
| Yes | [result]((#item-count)) |  | Object | The resulting recipe. |
#### Example
```json
{
    "identifier": "minecraft:stone_brick_wall_from_stonecutter",
    "ingredients": {
        "item": "minecraft:stone_bricks"
    },
    "result": {
        "item": "minecraft:stone_brick_wall"
    },
    "count": 1
}
```
[Back to top](#)

---

### Smithing
Additional properties

| Required | Name | Default | Type | Description |
|--|--|--|--|--|
| Yes | identifier |  | String | The id of the recipe |
| No | description |  | [RAW JSON](https://minecraft.fandom.com/wiki/Raw_JSON_text_format) | The description of the recipe |
| Yes | [base](#item) |  | Object | The base item |
| Yes | [addition](#item) |  | Object | The item that you add to the base item. |
| Yes | [result](#item-count) |  | Object | The resulting recipe. |
#### Example
```json
{
    "identifier": "minecraft:netherite_pickaxe",
    "base": {
        "item": "minecraft:diamond_pickaxe"
    },
    "addition": {
        "item": "minecraft:netherite_ingot"
    },
    "result": {
        "item": "minecraft:netherite_pickaxe"
    }
}
```
[Back to top](#)

---

### Item Count
| Required | Name  | Default | Type             | Description                  |
|----------|-------|---------|------------------|------------------------------|
| Yes      | item  |         | String           | The item to give.            |
| No       | count | `1`     | Integer [`1-64`] | The number of items to give. |
#### Example
```json
{
    "item": "minecraft:stone",
    "count": 2
}
```
[Back to top](#)

---

### Item
| Required | Name  | Default | Type             | Description                  |
|----------|-------|---------|------------------|------------------------------|
| Yes      | item  |         | String           | The item to give.            |
#### Example
```json
"item": "minecraft:stone"
```
[Back to top](#)

---

### Pattern
`pattern` is an array (1-3) items. Values inside array match the values in [key](#key) max of 3 characters per item. Use a space as an empty slot.
#### Examples
```json
{
    "pattern": [
        "###",
        "###"
    ]
}
```
```json
{
    "pattern": [
        "#"
    ]
}
```
```json
{
    "pattern": [
        "###",
        "###",
        "###"
    ]
}
```
[Back to top](#)

---

### Key
`key` defines the characters inside [pattern](#pattern).
#### Examples
```json
{
    "key": {
        "#": {
            "item": "minecraft:stone"
        }
    }
}
```
[Back to top](#)

---

### Msgbox

| Required | Name     | Default | Type         | Description                                     |
|----------|----------|---------|--------------|-------------------------------------------------|
| No       | icon     |         | String       | The image to use as a icon.                     |
| No       | color    |         | String       | The color for the msgbox. Must be a 6 digit hex |
| Yes      | contents |         | [RAW JSON](https://minecraft.fandom.com/wiki/Raw_JSON_text_format) | The contents of the msgbox, supports RAW JSON   |

#### Examples
```json
{
    "icon": "./assets/favicon.png",
    "color": "#ff0000",
    "contents": {
        "text": "A msg box",
        "bold": true,
        "underlined": true
    }
}
```

[Back to top](#)