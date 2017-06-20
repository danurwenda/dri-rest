var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stockSchema = new Schema({
    ts: {
        type: Date,
        required: true
    },
    open: {
        type: Number,
        required: true
    },
    high: {
        type: Number,
        required: true
    },
    low: {
        type: Number,
        required: true
    },
    close: {
        type: Number,
        required: true
    }
});

// methods ======================
// find a set of records from a specified time range
// see https://github.com/highcharts/highcharts/blob/master/samples/data/from-sql.php
stockSchema.statics.fromTo = function ($start, $end, cb) {
    var $range = $end - $start;
    var $table;
    // find the right table
// two days range loads minute data
    if ($range < 2 * 24 * 3600 * 1000) {
        $table = 'stockquotes';

// one month range loads hourly data
    } else if ($range < 31 * 24 * 3600 * 1000) {
        $table = 'stockquotes_hour';

// one year range loads daily data
    } else if ($range < 15 * 31 * 24 * 3600 * 1000) {
        $table = 'stockquotes_day';
// greater range loads monthly data
    } else {
        $table = 'stockquotes_month';
    }
    return this.find({

    }, cb);
};

module.exports = stockSchema;