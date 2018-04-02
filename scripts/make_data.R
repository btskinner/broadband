
## libraries
libs <- c('tidyverse','RSQLite')
lapply(libs, require, character.only = TRUE)

## directories
ddir <- '../data/'

## functions
`%+%` <- function(a,b) paste0(a,b)

## =============================================================================
## Broadband choropleth maps
## =============================================================================

## get database connection
bb_con <- dbConnect(SQLite(), ddir %+% 'bb.db')

## get census block group populations
bgpop <- read_csv(ddir %+% 'CenPop2010_Mean_BG.txt') %>%
    setNames(tolower(names(.))) %>%
    mutate(fips = statefp %+% countyfp %+% tractce %+% blkgrpce) %>%
    select(fips, pop = population)

## get table names
bb_tables <- dbListTables(bb_con)

## init list
bb_df_list <- list()

## loop to build county-level datasets
for (tab in bb_tables) {

    message('Now working with: ' %+% tab)

    ## read/clean
    df <- dbReadTable(bb_con, tab) %>%
        ## drop measure count
        select(-mcount) %>%
        ## add in population data
        left_join(bgpop, by = 'fips') %>%
        ## drop if pop is missing (non-states)
        filter(!is.na(pop)) %>%
        ## substring to county fips (5 digit)
        mutate(fips = substr(fips, 1, 5)) %>%
        ## group by county
        group_by(fips) %>%
        ## population-weighted mean
        summarise_at(.vars = vars(pcount, download, upload),
                     .funs = funs(weighted.mean(., pop))) %>%
        ## adds/changes
        mutate(tab = tab,
               fips = as.integer(fips),
               p = as.integer(round(pcount * 100, 3)),
               d = as.integer(round(download * 100, 3)),
               u = as.integer(round(upload * 100, 3))) %>%
        ## drop
        select(-c(pcount, download, upload)) %>%
        ## ungroup
        ungroup()

    ## add to list
    bb_df_list[[tab]] <- df

}

## bind into one tbl_df
bb_df <- bind_rows(bb_df_list) %>%
    arrange(fips, tab)

## disconnect from broadband database
dbDisconnect(bb_con)

## make wide for map
df <- bb_df %>%
    mutate(tab = recode(tab,
                        'December_2010' = 1L,
                        'June_2011' = 2L,
                        'December_2011' = 3L,
                        'June_2012' = 4L,
                        'December_2012' = 5L,
                        'June_2013' = 6L,
                        'December_2013' = 7L,
                        'June_2014' = 8L)) %>%
    arrange(fips, tab) %>%
    gather(measure, val, -c(fips,tab)) %>%
    unite('mt', c('measure','tab'), sep = '') %>%
    spread(mt, val) %>%
    rename(f = fips)

## write
write_tsv(df, ddir %+% 'map_data.tsv', na = '')

## =============================================================================
## END SCRIPT
## #############################################################################
