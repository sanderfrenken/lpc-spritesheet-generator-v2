function generateListHTML(json) {
  const definition = JSON.parse(loadFile(json));
  const variants = definition.variants
  const name = definition.name
  const typeName = definition.type_name

  var requiredSexes = [];
  var previewRow = 2;
  if (definition.preview_row !== undefined) {
    previewRow = definition.preview_row
  }
  if (definition.layer_1.male !== undefined) {
    requiredSexes.push("male");
  }
  if (definition.layer_1.female !== undefined) {
    requiredSexes.push("female");
  }
  if (definition.layer_1.child !== undefined) {
    requiredSexes.push("child");
  }
  if (definition.layer_1.muscular !== undefined) {
    requiredSexes.push("muscular");
  }
  if (definition.layer_1.pregnant !== undefined) {
    requiredSexes.push("pregnant");
  }

  const requiredSex = requiredSexes.join(",");

  const startHTML = `<li data-required="[REQUIRED_SEX]"><span class="condensed">${name}</span><ul>`.replace("[REQUIRED_SEX]", requiredSex);
  const templateHTML = loadFile("html_templates/template-general.html");
  const endHTML = '</ul></li>';

  var idx = 0;
  var listItemsHTML = `<li><input type="radio" id="${typeName}-none" name="${typeName}"> <label for="${typeName}-none">No ${typeName}</label></li>`;
  for (variant in variants) {
    const itemName = variants[idx];
    const itemIdFor = typeName + "-" + name.replaceAll(" ", "_") +  "_" + itemName.replaceAll(" ", "_");

    var dataFiles = "";
    var sexIdx = 0;
    for (sex in requiredSexes) {
      for (jdx =1; jdx < 10; jdx++) {
        const layerDefinition = definition[`layer_${jdx}`];
        if (layerDefinition !== undefined) {
          if (sexIdx === 0) {
            const zPos = definition[`layer_${jdx}`].zPos;
            dataFiles += "data-preview_row=" + previewRow + " data-layer_" + jdx + "_zpos=" + zPos + " ";
            const oversize = layerDefinition.oversize;
            if (oversize !== undefined) {
              dataFiles += `data-layer_${jdx}_oversize=` + oversize + " "
            }
          }
          const file = layerDefinition[requiredSexes[sexIdx]]
          if (file !== null && file !== "") {
            dataFiles += "data-layer_" + jdx + "_" + requiredSexes[sexIdx] + "=\"" + file + itemName.replaceAll(" ", "_") + ".png\" ";
          }
        } else {
          break;
        }
      }
      sexIdx += 1;
    }
    listItemsHTML += templateHTML
      .replaceAll("[ID_FOR]", itemIdFor)
      .replaceAll("[TYPE_NAME]", typeName)
      .replaceAll("[NAME]", itemName)
      .replaceAll("[DATA_FILE]", dataFiles);
    idx += 1;
  }
  return startHTML + listItemsHTML + endHTML;
}

function replaceDivs() {
  const matcher = "sheet_";
  $("div").each(function() {
    var id = $(this).attr('id');
    if (!!id && id.includes(matcher)) {
      $(`#${id}`).replaceWith(generateListHTML(`sheet_definitions/${id.replace(matcher,"")}.json`));
    }
  });
}
