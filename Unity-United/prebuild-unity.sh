#!/usr/bin/env bash
version_to_use="none"

match_version()
{
  version_to_use="none"
  case $1 in
    "6000.0.43f1")
      ;&
    "6000.0.55f1")
      ;&
    "6000.0.59f2")
      ;&
    "6000.0.60f1")
      ;&
    "6000.0.61f1")
      ;&
    "6000.0.63f1")
      ;&
    "6000.0.65f1")
      version_to_use="6000.0.59f2"
      ;;
    "6000.2.0f1")
      ;&
    "6000.2.7f2")
      ;&
    "6000.2.8f1")
      ;&
    "6000.2.9f1")
      ;&
    "6000.2.10f1")
      ;&
    "6000.2.12f1")
      version_to_use="6000.2.7f2"
      ;;
    *)
      echo "unknown version for $1"
      ;;
  esac
}

echo "finding all projects in $(pwd)..."
projects=$(find -name ProjectVersion.txt -exec bash -c 'grep --with-filename m_EditorVersion: "{}"' \;)
echo "found these projects:"
echo "${projects}"

echo "$projects" | while read -r line
do
  settings_path="$(dirname "$(echo "${line}" | cut -d':' -f 1)")"
  project="$(dirname "${settings_path}")"
  match_version "$(echo "$line" | awk -F" " '{print $NF}')"
  echo "opening unity ${version_to_use} for path: ---${project}---"
  time ~/Unity/Hub/Editor/${version_to_use}/Editor/Unity -projectpath "${project}" -quit -batchmode
done
