
// https://legopitstop.github.io/Minecraft-Recipe-Display/index.html?json=./examples/morefood.json&lang=en_us

const JSONURL = parseURLParams(location.search)
const RECIPES = getJSONURL()

const fetched = {};

function getFetchedJSON(url, callback){
    if(fetched[url]){
        if(fetched[url].data){
            callback.bind($)(JSON.parse(JSON.stringify(fetched[url].data)));
        }else{
            fetched[url].callbacks.push(callback)
        }
    }else{
        fetched[url] = {data:null, callbacks:[callback]};
        $.getJSON(url, function(result){
            fetched[url].data = JSON.parse(JSON.stringify(result));
            fetched[url].callbacks.forEach(c => c.bind($)(JSON.parse(JSON.stringify(result))));
        });
    }
}

/* Jqueryui */
$(function () {
    $(document).tooltip({
        track: true,
        position: {
            my: "left+15 center-15",
            at: "right center"
        },
        hide: { effect: "fade", duration: 0 }
    });
    backToTop({
        padding: 100,
        color: 'var(--text)',
        backgroundColor: 'var(--table-header)',
        hoverEvent: {
            color: 'gray',
            backgroundColor: 'var(--background-secondary)'
        }
    })
});

$(document).ready(function () {
    console.log('lang: ' + getLang())

    // render the recipes
    renderRecipes();

});

function getJSONURL() {
    if (JSONURL && JSONURL.json) {
        console.log(`JSON: ${JSONURL.json}`);
        return JSONURL.json;
    } else {
        console.log('JSON: default');
        return document.querySelector("[rel=recipe]").href;
    }
}

function msgbox(msg) {
    if (typeof msg == 'object') {
        if (!msg.color) { msg.color = '#0000ff' }

        var color = `--msgbox-background-color: rgba(${hexToRgb(msg.color).r}, ${hexToRgb(msg.color).g}, ${hexToRgb(msg.color).b}, 20%); --msgbox-border-left-color: ${msg.color}; --msgbox-border-color: rgba(${hexToRgb(msg.color).r}, ${hexToRgb(msg.color).g}, ${hexToRgb(msg.color).b}, 30%);`
        if (msg.contents) {
            if (msg.icon) {
                $('#msgbox').append(`<div class="msgbox" style="color: white;${color}"><img class="msgbox-icon" src="${msg.icon}"> <div class="msgbox-contents">${rawjson(msg.contents)}</div></div>`)
            } else {
                $('#msgbox').append(`<div class="msgbox" style="color: white;${color}"> <div class="msgbox-contents">${rawjson(msg.contents)}</div></div>`)
            }
        } else {
            console.warn(`Missing property "contents".`)
        }
    } else {
        console.warn('Incorrect type. Expected "object".')
    }
}

function renderRecipes() {
    var UUID = randomId();
    getFetchedJSON(RECIPES, function (file) {
        if (file.description) {
            /* meta */
            if (file.description.meta) {
                const M = file.description.meta
                if (M.title) {
                    document.querySelector('title').innerHTML = M.title + ' | Minecraft Recipe Display'
                    var all = document.querySelectorAll('.MetaTitle')
                    for (let i = 0; i < all.length; i++) {
                        const A = all[i];
                        A.content = M.title
                    }
                };
                if (M.description) {
                    var all = document.querySelectorAll('.MetaDesc')
                    for (let i = 0; i < all.length; i++) {
                        const A = all[i];
                        A.content = M.description
                    }
                };
                if (M.url) {
                    var all = document.querySelectorAll('.MetaURL')
                    for (let i = 0; i < all.length; i++) {
                        const A = all[i];
                        A.content = M.url
                    }
                };
                if (M.image) {
                    document.querySelector('.MetaIcon').href = M.image
                    var all = document.querySelectorAll('.MetaImage')
                    for (let i = 0; i < all.length; i++) {
                        const A = all[i];
                        A.content = M.image
                    }
                };

            }
            /* description */
            if (file.description.theme) { var theme = file.description.theme } else { var theme = 'light' };
            if (file.description.msgbox) {
                if (Array.isArray(file.description.msgbox)) {
                    for (let i = 0; i < file.description.msgbox.length; i++) {
                        const M = file.description.msgbox[i];
                        msgbox(M)
                    }
                } else if (typeof file.description.msgbox == 'object') {
                    msgbox(file.description.msgbox)

                } else if (typeof file.description.msgbox == 'string') {
                    if (file.description.msgbox == 'default') {
                        var json = {
                            "icon": "./assets/favicon.png",
                            "color": "#ff8800",
                            "contents": [
                                {
                                    "text": "This is the default recipe page.",
                                    "bold": true
                                },
                                " ",
                                {
                                    "text": "Learn more",
                                    "underlined": true,
                                    "clickEvent": {
                                        "action": "open_url",
                                        "value": "./docs"
                                    }
                                }
                            ]
                        }
                        msgbox(json)

                    }
                } else {
                    console.warn('Incorrect type. Expected "object" or "array"')
                }
            }
            var recipeFileUUID = file.description.id || 'recipe';
            if (theme == 'dark') {
                console.log('theme: ' + theme);
                document.querySelector(':root').classList.add('dark');

            } else if (theme == 'light') {
                console.log('theme: ' + theme)
                document.querySelector(':root').classList.add('light');

            } else {
                console.log('theme: default')
                document.querySelector(':root').classList.add('light');
            }

            /* resources */
            file.resources.textures.minecraft = { type: "spritesheet", file: "https://cdn.jsdelivr.net/gh/legopitstop/Javascript/libs/Sprite/minecraft/sprite.json" }
            file.resources.langs.minecraft = './assets/${NAMESPACE}/lang/en_us.json#item.${NAMESPACE}.${NAME}'

            document.querySelector('#' + recipeFileUUID).innerHTML = '<!-- Injected by recipe.js --><tbody><table class="recipe-table" id="' + UUID + '"><tr><th>Ingredients</th><th>Crafting recipe</th><th>Description</th></tr><!-- recipes here --></table></tbody>'
            /* recipes */
            if (file.recipes) {
                /* Render recipes. */
                for (let i = 0; i < file.recipes.length; i++) {
                    const R = file.recipes[i]
                    /* all types */
                    if (R) {
                        if (R.identifier) {
                            if (R.type) {
                                var Description = ''
                                var Return = ''
                                var Type = ''
                                var Ingredients = ''
                                var Identifier = randomId();
                                if (R.description) { Description = rawjson(R.description) };
                                if (R.identifier) { Identifier = R.identifier }
                                /* per type */
                                if (R.type == 'minecraft:crafting_shaped') {
                                    if (R.pattern) {
                                        if (R.key) {
                                            if (R.result) {
                                                if (R.result.item) {
                                                    Return = itemBuilder(file, R.result.item, 'result', R.result.count) + shapedBuilder(file, R)
                                                    Type = 'crafting_shaped'
                                                    Ingredients = getShapedIngredients(file, R)
                                                } else {
                                                    console.warn('Missing property "item".')
                                                }
                                            } else {
                                                console.warn('Missing property "result".')
                                            }
                                        } else {
                                            console.warn('Missing property "key".')
                                        }
                                    } else {
                                        console.warn('Missing property "pattern".')
                                    }
                                } else if (R.type == 'minecraft:crafting_shapeless') {
                                    if (R.ingredients) {
                                        if (R.result) {
                                            if (R.result.item) {
                                                Return = itemBuilder(file, R.result.item, 'result', R.result.count) + shapelessBuilder(file, R.ingredients)
                                                Type = 'crafting_shapeless'
                                                Ingredients = ingredientsBuilder(file, R.ingredients)
                                            } else {
                                                console.warn('Missing property "item".')
                                            }
                                        } else {
                                            console.warn('Missing property "result".')
                                        }
                                    } else {
                                        console.warn('Missing property "ingredients".')
                                    }

                                } else if (R.type == 'minecraft:smelting') {
                                    if (R.ingredients) {
                                        if (R.result) {
                                            if (R.result.item) {
                                                Return = itemBuilder(file, R.ingredients.item, 'input') + itemBuilder(file, R.result.item, 'result')
                                                Type = 'smelting'
                                                Ingredients = ingredientsBuilder(file, R.ingredients) + ` + Any <a href="https://minecraft.fandom.com/wiki/Fuel" target="_blank">fuel</a>`

                                            } else {
                                                console.warn('Missing property "item".')
                                            }
                                        } else {
                                            console.warn('Missing property "result".')
                                        }
                                    } else {
                                        console.warn('Missing property "ingredients".')
                                    }
                                } else if (R.type == 'minecraft:blasting') {
                                    if (R.ingredients) {
                                        if (R.result) {
                                            if (R.result.item) {
                                                Return = itemBuilder(file, R.ingredients.item, 'input') + itemBuilder(file, R.result.item, 'result')
                                                Type = 'smelting'
                                                Ingredients = ingredientsBuilder(file, R.ingredients) + ` + Any <a href="https://minecraft.fandom.com/wiki/Fuel" target="_blank">fuel</a>`

                                            } else {
                                                console.warn('Missing property "item".')
                                            }
                                        } else {
                                            console.warn('Missing property "result".')
                                        }
                                    } else {
                                        console.warn('Missing property "ingredients".')
                                    }
                                } else if (R.type == 'minecraft:smoking') {
                                    if (R.ingredients) {
                                        if (R.result) {
                                            if (R.result.item) {
                                                Return = itemBuilder(file, R.ingredients.item, 'input') + itemBuilder(file, R.result.item, 'result')
                                                Type = 'smelting'
                                                Ingredients = ingredientsBuilder(file, R.ingredients) + ` + Any <a href="https://minecraft.fandom.com/wiki/Fuel" target="_blank">fuel</a>`

                                            } else {
                                                console.warn('Missing property "item".')
                                            }
                                        } else {
                                            console.warn('Missing property "result".')
                                        }
                                    } else {
                                        console.warn('Missing property "ingredients".')
                                    }
                                } else if (R.type == 'minecraft:campfire_cooking') {
                                    if (R.ingredients) {
                                        if (R.result) {
                                            if (R.result.item) {
                                                Return = itemBuilder(file, R.ingredients.item, 'input') + itemBuilder(file, R.result.item, 'result')
                                                Type = 'smelting'
                                                Ingredients = ingredientsBuilder(file, R.ingredients) + ` + Any <a href="https://minecraft.fandom.com/wiki/Fuel" target="_blank">fuel</a>`

                                            } else {
                                                console.warn('Missing property "item".')
                                            }
                                        } else {
                                            console.warn('Missing property "result".')
                                        }
                                    } else {
                                        console.warn('Missing property "ingredients')
                                    }
                                } else if (R.type == 'minecraft:stonecutting') {
                                    if (R.ingredients) {
                                        if (R.result) {
                                            if (R.result.item) {
                                                Return = itemBuilder(file, R.ingredients.item, 'input') + itemBuilder(file, R.result.item, 'preview') + itemBuilder(file, R.result.item, 'result', R.count)
                                                Type = 'stonecutter'
                                                Ingredients = ingredientsBuilder(file, R.ingredients)

                                            } else {
                                                console.warn('Missing property "item".')
                                            }
                                        } else {
                                            console.warn('Missing property "result".')
                                        }
                                    } else {
                                        console.warn('Missing property "ingredients".')
                                    }
                                } else if (R.type == 'minecraft:smithing') {
                                    if (R.base) {
                                        if (R.base.item) {
                                            if (R.addition) {
                                                if (R.addition.item) {
                                                    if (R.result) {
                                                        if (R.result.item) {
                                                            Return = itemBuilder(file, R.base.item, 'base') + itemBuilder(file, R.addition.item, 'addition') + itemBuilder(file, R.result.item, 'result')
                                                            Type = 'smithing'
                                                            Ingredients = ingredientsBuilder(file, [R.base, R.addition])
                                                        } else {
                                                            console.warn('Missing property "item".')
                                                        }
                                                    } else {
                                                        console.warn('Missing property "result".')
                                                    }
                                                } else {
                                                    console.warn('Missing property "item".')
                                                }
                                            } else {
                                                console.warn('Missing property "addition".')
                                            }
                                        } else {
                                            console.warn('Missing property "item".')
                                        }
                                    } else {
                                        console.warn('Misisng property "base".')
                                    }
                                } else if (R.type == 'rcore:custom') {
                                    console.error('This recipe type has not been added yet')
                                } else {
                                    console.error(`Type "${R.type}" is not accepted`)
                                }
                                if (Type == 'crafting_shaped') {
                                    var BackgroundImage = '<img src="./assets/' + theme + '/mc_crafting_shaped.png" alt=" " draggable="false">'
                                } else if (Type == 'crafting_shapeless') {
                                    var BackgroundImage = '<img src="./assets/' + theme + '/mc_crafting_shapeless.png" alt=" " draggable="false">'
                                } else if (Type == 'smelting') {
                                    var BackgroundImage = '<img src="./assets/' + theme + '/mc_smelting.gif" alt=" " draggable="false">'
                                } else if (Type == 'stonecutter') {
                                    var BackgroundImage = '<img src="./assets/' + theme + '/mc_stonecutter.png" alt=" " draggable="false">'
                                } else if (Type == 'smithing') {
                                    var BackgroundImage = '<img src="./assets/' + theme + '/mc_smithing.png" alt=" " draggable="false">'
                                };

                                // output
                                $('#' + UUID).append('<tr id="' + Identifier + '"><td class="ingredients ' + getItemName(Identifier) + '">' + Ingredients + '</hd><td class="recipe" type="' + Type + '">' + BackgroundImage + Return + '</hd><td class="description">' + Description + '</hd></tr>')

                            } else {
                                console.warn('Missing property "type"')
                            }
                        } else {
                            console.warn('Missing property "identifier".')
                        }
                    } else {
                        console.error('Recipe is not working? Check the syntax?')
                    }
                }
            } else {
                console.warn('Missing proeprty "recipes"')
            }

        } else {
            console.warn('Missing propery "description".')
        }
    });
}

function getLang() {
    if (JSONURL != undefined && JSONURL.lang != undefined) {
        return JSONURL.lang[0]
    } else {
        return 'en_us'
    }
}

function tagBuilder(json, tag) {
    var tags = json.resources.tags[getItemNamespace(tag)] || '/data/${NAMESPACE}/tags/items/${NAME}.json'
    //var tagFile2 = tags.replace(/\$\{NAMESPACE\}/g, getItemNamespace(tag)).replace(/\$\{NAME\}/g, getItemName(tag))
    var tagFile = resourceVarables(tags, tag)
    getFetchedJSON(tagFile, function (json) {
        return json.values
    });
}

function assetBuilder(json, item, id) {
    if (json.resources) {
        if (json.resources.textures) {
            const T = json.resources.textures[getItemNamespace(item)];
            if (typeof T == 'object') {
                if (T.type) {
                    if (T.type == 'spritesheet') {
                        if (T.file) {
                            // HERE
                            // document.getElementById('item-'+id).remove();
                            getFetchedJSON(T.file, function (s) {
                                loadSprite(item, '#item-' + id, s)
                            });
                            return '';
                        } else {
                            console.error('Missing property "file"');
                            return false;
                        }
                    } else {
                        console.error('Unknown asset type');
                        return false;
                    }
                } else {
                    console.error('Missing property "type"')
                    return false;
                }

            } else if (typeof T == 'string') {
                if (T) { var Resource = T } else { var Resource = './assets/${NAMESPACE}/textures/item/${NAME}.png' };
                var imageFile = resourceVarables(Resource, item);
                return imageFile;
            }
        }
    }
}

function translateName(item) {
    return toTitleCase(item)
}

function setTranslateName(id, json, item, target) {
    var lang = './assets/${NAMESPACE}/lang/en_us.json#item.${NAMESPACE}.${NAME}'
    if (json.resources) {
        if (json.resources.langs[getItemNamespace(item)]) {
            lang = json.resources.langs[getItemNamespace(item)]
        }
    }
    var out = resourceVarables(lang, item);
    testTrans(id, out)
    function testTrans(id, json) {
        var file = json.replace(/#.*/g, '')
        var name = json.replace(/.*#/g, '')
        getFetchedJSON(file, function (lang) {
            var getLang = lang[name] || name
            if (getLang == undefined) { var out = name } else { var out = getLang }
            if (typeof target == 'object') {
                for (let i = 0; i < target.length; i++) {
                    document.getElementById(id)[target[i]] = out;
                };
            } else {
                //console.log('missing lang: "' + item + '"');
                document.getElementById(id).title = out;
            }
        });
    }
    return true;
}

function toTitleCase(string) {
    var words = string.replace(/_/g, ' ').split(" ");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    return words.join(" ");
}

function ingredientsBuilder(json, recipes) {
    var out = ''
    if (typeof recipes == 'object') {
        if (recipes.item) {
            var UUID = uuid();
            var item = recipes.item;
            setTranslateName(UUID, json, item, ['title', 'innerHTML']);
            urlBuilder(item, UUID);
            return '<a id="' + UUID + '" title="" href="" target="_blank"></a>';

        } else {
            for (let i = 0; i < recipes.length; i++) {
                var UUID = uuid();;
                var item = recipes[i].item;
                if (i == recipes.length - 1) { var insertion = '' } else { var insertion = ' + <br>' };
                setTranslateName(UUID, json, item, ['title', 'innerHTML']);
                urlBuilder(item, UUID);
                out = out + '<a id="' + UUID + '" title="" href="" target="_blank"></a>' + insertion;
            };
            return out;
        }
    } else {
        var UUID = uuid();
        var item = recipes;
        setTranslateName(UUID, json, item, ['title', 'innerHTML']);
        urlBuilder(item, UUID);
        out = out + '<a id="' + UUID + '" title="" href="" target="_blank">asdf</a>';
        return out;
    }
};

function urlBuilder(item, id) {
    getFetchedJSON(RECIPES, function(R){
        if (!R.resources.links.minecraft) { R.resources.links.minecraft = "https://${NAMESPACE}.fandom.com/wiki/${WIKINAME}" } else { console.warn('Missing resoruce "minecraft".') }
        if (R.resources.links[getItemNamespace(item)]) {
            var links = R.resources.links[getItemNamespace(item)];
            if (links) { var Link = links } else { var Link = 'https://${NAMESPACE}.fandom.com/wiki/${WIKINAME}' };
            var URL = resourceVarables(Link, item);
            var regex = /\#.*/;
            if (links.match(regex)) {
                var getarable = URL.replace(/.*#/g, '');
                document.getElementById(id)?.removeAttribute("href");
                $('#' + id).click(function () {
                    scrollToId(getarable, true);
                });
            } else {
                (document.getElementById(id) || {}).href = URL;
            }
        } else {
            console.warn(`Missing property "${getItemNamespace(item)}"."`)
        }

    });
    return '';
}

function itemBuilder(json, item, slot, count) {
    var UUID4 = randomId();
    var img = ''
    /* Count Builder */
    var itemCount = ''
    if (count) {
        if (Number.isInteger(count)) {
            if (count >= 1) {
                if (count <= 64) {
                    itemCount = '<span class="count ' + slot + '">' + count + '</span>'
                } else {
                    console.warn('Value is above the maxium of 64.')
                }
            } else {
                console.warn('Value is below the minium of 0.')
            }
        } else {
            console.warn('Incorrect type. Expected "integer".')
        }
    }
    if (asset) {
        img = `background-image: url(${asset})`
    }
    if (typeof item == 'string') {
        urlBuilder(item, UUID4)
        setTranslateName(UUID4, json, item)
        var asset = assetBuilder(json, item, UUID4)
        return `<a id="${UUID4}" href="" target="_blank" aria-labelledby="${toTitleCase(getItemName(item))}" title=""><span id="item-${UUID4}" class="mc_item ${slot}" style="${img}"><span>${itemCount}</a>`;
    } else if (Array.isArray(item)) {
        console.warn('Multiple items are not supported yet.')
        return '';
    } else {
        console.warn('Incorrect type. Expected "string" or "array".')
        return '';
    }

}

function getItemNamespace(itemID) {
    return itemID.replace(/:.*/g, '');
}

function getItemName(itemID) {
    return itemID.replace(/.*:/g, '');
}

function resourceVarables(resrouce, value) {
    var out = resrouce
        .replace(/\$\{NAME\}/g, getItemName(value))
        .replace(/\$\{NAMESPACE\}/g, getItemNamespace(value))
        .replace(/\$\{WIKINAME\}/g, toTitleCase(getItemName(value)).replace(/\s/g, '_'))
        .replace(/\$\{LANG\}/g, getLang())
    return out;
}

function shapelessBuilder(file, R) {
    let ingredients = '';
    let index = 0;
    for (let i = 0; i < R.length; i++) {
        if (R[i].item) {
            if (R[i].count) {
                for (let c = 0; c < R[i].count; c++) {
                    index = index + 1;
                    var slot = 'slot' + index;
                    ingredients = ingredients + itemBuilder(file, R[i].item, slot);
                };
            } else {
                index = index + 1;
                var slot = 'slot' + index;
                ingredients = ingredients + itemBuilder(file, R[i].item, slot);
            };
        } else {
            console.warn('Missing property "item".')
        }
    }
    if (index > 9) {
        console.warn('Total count of all ingredients must be at least 9, but got ' + index)
    }
    return ingredients
}

function shapedBuilder(file, R) {
    let ingredients = ''
    if (R.pattern) {
        if (R.pattern[0]) {
            var Pattern = R.pattern[0]
            for (let i = 0; i < Pattern.length; i++) {
                if (Pattern[i] != ' ') {
                    var key = Pattern[i];
                    var slot = i + 1;
                    if (R.key[key]) {
                        if (R.key[key].item) {
                            ingredients = ingredients + itemBuilder(file, R.key[key].item, 'slot' + slot);
                        } else {
                            console.warn('Missing property "item"');
                        }
                    } else {
                        console.warn(`Missing property "${key}".`);
                    }
                }
            }
        };
        if (R.pattern[1]) {
            var Pattern = R.pattern[1]
            for (let i = 0; i < Pattern.length; i++) {
                if (Pattern[i] != ' ') {
                    var key = Pattern[i];
                    var slot = i + 4;
                    if (R.key[key]) {
                        if (R.key[key].item) {
                            ingredients = ingredients + itemBuilder(file, R.key[key].item, 'slot' + slot);
                        } else {
                            console.warn('Missing property "item"');
                        }
                    } else {
                        console.warn(`Missing property "${key}".`);
                    }
                }
            }
        }
        if (R.pattern[2]) {
            var Pattern = R.pattern[2]
            for (let i = 0; i < Pattern.length; i++) {
                if (Pattern[i] != ' ') {
                    var key = Pattern[i];
                    var slot = i + 7;
                    if (R.key[key]) {
                        if (R.key[key].item) {
                            ingredients = ingredients + itemBuilder(file, R.key[key].item, 'slot' + slot);
                        } else {
                            console.warn('Missing property "item"');
                        }
                    } else {
                        console.warn(`Missing property "${key}".`);
                    }
                }
            }
        };
        if (R.pattern.length > 3) {
            console.warn('Array has too many items. Expected 3 or fewer');
            return false;
        } else {
            return ingredients;
        }
    } else {
        console.warn('Missing property "pattern".');
        return false;
    }

}

function getShapedIngredients(file, recipe) {
    return recipe.result.item;
}
