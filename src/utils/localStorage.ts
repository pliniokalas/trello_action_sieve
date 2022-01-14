// Update the localStorage object with new data.
function updateConfig(field: { name: string, value: string }) {
  const configJson = localStorage.getItem('config');

  let config: { [k: string]: string } = configJson
    ? JSON.parse(configJson)
    : {};

  config[field.name] = field.value;
  localStorage.setItem('config', JSON.stringify(config))
}

export { updateConfig };
