import { variable } from "./../variables/platform"

export const theme = (variables = variable) => {
  const textAreaTheme = {
    ".underline": {
      borderBottomWidth: variables.borderWidth,
      marginTop: 5,
      borderColor: variables.inputBorderColor,
    },
    ".bordered": {
      borderWidth: 1,
      marginTop: 5,
      borderColor: variables.inputBorderColor,
    },
    "color": variables.textColor,
    "paddingLeft": 10,
    "paddingRight": 5,
    "fontSize": 15,
    "textAlignVertical": "top",
  }

  return textAreaTheme
}
