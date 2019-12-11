import time


_weekdayname = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
_monthname = [None,
              'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


def cookie_date(future=0):
    year, month, day, hh, mm, ss, wd, y, z = time.gmtime(time.time() + future)

    return "%s, %02d-%3s-%4d %02d:%02d:%02d GMT" % \
           (_weekdayname[wd], day, _monthname[month], year, hh, mm, ss)
