export default function prettyGroup (groupStr) {
  return groupStr.replace(/\|/g, ' + ');
}
