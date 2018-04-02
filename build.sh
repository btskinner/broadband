#!/usr/local/bin/bash

# ==============================================================================
# SET OPTIONS
# ==============================================================================

usage()
{
    cat <<EOF
 
 PURPOSE:
 This script builds jekyll website.
 
 USAGE: 
 $0 <arguments>
 
 ARGUMENTS:
    [-b]        Suffix to go on _config*.yml and _site* directory
    [-v]        Build verbosely (optional flag)
    		
 EXAMPLE:
 
 ./build.sh -b _dev

 DEFAULT VALUES:

 b = <empty string>
 v = 0 (knit/build quietly)

EOF
}

# defaults
b=""
v=0

build_q="--quiet"

while getopts "hb:v" opt;
do
    case $opt in
	h)
	    usage
	    exit 1
	    ;;
	b)
	    b=$OPTARG
	    ;;
	v)
	    v=1
	    ;;
	\?)
	    usage
	    exit 1
	    ;;
    esac
done

# change quiet options if verbose flag is chosen
if [[ $v == 1 ]]; then
    build_q=""
fi

printf "\nBUILD JEKYLL SITE\n"
printf -- "----------------------------------\n"

# ==============================================================================
# BUILD
# ==============================================================================

printf "\n[ Building... ]\n\n"

jekyll build $build_q --config ./_config${b}.yml --destination ./_site${b} 
printf "  Built site ==>\n"
printf "     config file:   _config$b\n"
printf "     location:      _site$b\n"

# ==============================================================================
# BUILD
# ==============================================================================

printf "\n[ Finished! ]\n\n"

# ==============================================================================
