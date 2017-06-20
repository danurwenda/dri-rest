# db
We have one and only one db to sync to, let's call it REFDB.

DBs below are required :

    1. A collection containing latest snapshot of REFDB.(SNAPSHOT)
    2. A database with collections (one for each stock) containing time-series 
of every transaction {timestamp (indexed), price, volume} (TRANSAC)
    3. A database with collections (one for each stock) containing time-series
OHLC, each entry represents 1 minute range (MINUTES)
    4. A database with collections (one for each stock) containing time-series
OHLC, each entry represents 1 hour range (HOURS)
    5. A database with collections (one for each stock) containing time-series
OHLC, each entry represents 1 day range (DAYS)
    6. A database with collections (one for each stock) containing time-series
OHLC, each entry represents 1 month range (MONTHS)

Actually DB no 3 to 6 can be calculated on-demand using data in TRANSAC, but it will consume
too much processing time and resources. So we compute and store them beforehand instead.

Check reference db periodically, compare each stock with SNAPSHOT to check
 whether there's an update for that particular stock.

If there's an update, we update DB number 1 to 6 in their order.

    1. Update the SNAPSHOT
    2. Insert new entry to TRANSAC (actually this db should never be UPDATE'd, only CREATE'd)
    3. Insert or update to MINUTES
    4. Insert or update to HOURS
    5. Insert or update to DAYS
    6. Insert or update to MONTHS
