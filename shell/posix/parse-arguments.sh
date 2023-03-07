#!/bin/sh

# fail on non zero exit code (-e), on expansion of an undefined variable (-u)
set -eu

# parse arguments as long as there're some args left
# $# -> number of arguments
while [ "$#" -gt 0 ]; do
  case $1 in
    -h | --help)
      # escape a newline for easy multiline strings
      echo "\
Usage: parse-arguments
  -h, --help                Display this message.
  -m, --message <string>    Prints the given message.
  -v, --version             Display the version
"
      exit 0
    ;;
    -m | --message)
      # expects an additional argument, so lets validate!
      # -z -> zero length string
      if [ -z "$2" ]; then
        echo "No text given for the '--message' option."
        exit 1
      fi
      # either save as var or handle immediatly
      echo "$2"
      # removes -m, --message option, the shift and the end of every loop will
      # remove the extra argument
      shift
      exit 0
    ;;
    -v | --version)
      echo "1.0.0"
      exit 0
    ;;
    # you can use glob-patterns
    # this is matches any string, used as fallback
    *) 
      echo "Unknown option '$1'"
      exit 1
    ;;
  esac
  # works like shift on an array
  # $1 is removed, $2 becomes $1, $3 becomes $2 so on
  shift
done
