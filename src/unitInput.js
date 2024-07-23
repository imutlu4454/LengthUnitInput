(function ($) {

    var defaults = {
        //  stringPermit: false
        allowNegativeNumbers:false
    };

    $.fn.extend({
        LengthUnitInput: function (options) {
            var wrapper;
            var text_input = null;

            options = $.extend(true, {},
                defaults,
                options
            );
            this.each(function () {
                if (this.tagName == 'INPUT' && $(this).hasClass('length-text-input') &&
                    $(this).closest('.length-unit-input').length > 0) {
                    wrapper = $(this).closest('.length-unit-input');
                }
                else {
                    wrapper = $(this);
                }



                var unit = wrapper.attr('unit') ? parseInt(wrapper.attr('unit')) : 1;
                options.allowNegativeNumbers = wrapper.attr('allowNegativeNumbers') ? parseInt(wrapper.attr('allowNegativeNumbers')) : 0;
                var input_type = wrapper.attr('input-type') ? parseInt(wrapper.attr('input-type')) : 1;
                var org_unit = parseInt(wrapper.attr('org-unit'));


                wrapper.attr('input-type', input_type);
                if (wrapper.hasClass('length-unit-input') && unit == org_unit) {

                    if (input_type == 1) {
                        if (wrapper.prop("tagName") == "INPUT") {
                            text_input = wrapper;
                        }
                        else {
                            text_input = wrapper.find('.length-text-input');
                        }

                    }
                }
                else {
                    wrapper.attr('org-unit', unit);
                    wrapper.addClass('length-unit-input');


                    if (input_type == 1) {
                        if (wrapper.prop("tagName") == "INPUT") {
                            text_input = wrapper;
                            text_input.addClass('length-text-input');

                            text_input.on('change', function () {
                                var elem = $(this).LengthUnitInput();
                                elem.setLength(elem.getLength());
                            });
                        }
                        else {
                            wrapper.html("");
                            switch (unit) {
                                case 1:
                                    wrapper.html(`<div class="input-group li-group">
												<input class="length-text-input form-control autofocus select-on-focus number" type="text" placeholder="1' 1-3/4“">
											</div>`);

                                    break;
                                case 2:
                                    wrapper.html(`<div class="input-group li-group">
												<input class="length-text-input form-control autofocus select-on-focus number" type="text" placeholder="1m 1.5cm“">
											</div>`);
                                    break;
                            }
                            text_input = wrapper.find('.length-text-input');


                            wrapper.on('change', '.length-text-input', function () {
                                var elem = $(this).closest('.length-unit-input').LengthUnitInput();
                                elem.setLength(elem.getLength());
                            });
                        }

                        setUnitInput1Length(unit, wrapper.attr('default-val'));

                    }
                    else {
                        wrapper.html("");
                        switch (unit) {
                            case 1:


                                wrapper.html(`<div class="input-group li-group">
												<input class="feet form-control autofocus select-on-focus number" type="text" placeholder="feet">
												<div class="input-group-append"><span class="input-group-text">'</span></div>
											</div>
									
											<div class="input-group  li-group">
												<input class="inc form-control select-on-focus number" type="text" placeholder="inc">
												<div class="input-group-append"><span class="input-group-text">"</span></div>
											</div>
									
											<div class="li-group d-flex flex-column">
												<div class="input-group inc-k-1-wrap">
													<input class="inc-k-1 form-control select-on-focus number"  type="text" placeholder="">
												</div>
												<div class="slash-div" style=""></div>
												<div class="input-group inc-k-2-wrap" style="">
													<input class="inc-k-2 form-control select-on-focus number"  type="text" placeholder="">
												</div>
									
											</div>`);


                                break;
                            case 2:
                                wrapper.html(`<div class="input-group li-group">
								<input class="meter form-control autofocus select-on-focus number" type="text" placeholder="meter">
								<div class="input-group-append"><span class="input-group-text">m</span></div>
							</div>
					
							<div class="input-group  li-group">
								<input class="centimeter form-control select-on-focus number" type="text" placeholder="centimeter">
								<div class="input-group-append"><span class="input-group-text">cm</span></div>
							</div>
							<div class="input-group  li-group">
								<input class="millimeter form-control select-on-focus number" type="text" placeholder="centimeter">
								<div class="input-group-append"><span class="input-group-text">mm</span></div>
							</div>`);
                                break;
                        }
                        setUnitInputLength(unit, wrapper.attr('default-val'));
                    }

                }

            });
            if(typeof wrapper==='undefined' ||  wrapper.length==0)
                return null;
            wrapper.getLength = function () {
                var unit = parseInt(wrapper.attr('org-unit'));
                options.allowNegativeNumbers = wrapper.attr('allowNegativeNumbers') ? parseInt(wrapper.attr('allowNegativeNumbers')) : 0;
                var input_type = wrapper.attr('input-type') ? parseInt(wrapper.attr('input-type')) : 0;
                if (input_type == 1) {
                    var lentextm, patt, result,len_negatife=false;
                    lentext = text_input.val();
                    lentext= lentext.trim();
                    if (lentext.length == 0)
                        return 0;
                    if(lentext.startsWith("-"))
                    {
                        len_negatife=true;
                        lentext=lentext.substring(1);
                    }
                    switch (unit) {
                        case 1:
                            var feet = 0, inc = 0, inc_k1 = 0, inc_k2 = 1;
                            patt = /([\d|.]*)\D*'\D*([\d|.]+)[ |-]\D*([\d|.]*)\/([\d|.]*)\D*"\D*/i;
                            result = lentext.match(patt);

                            if (result) {
                                feet = parseFloat(result[1]);
                                inc = parseFloat(result[2]);
                                inc_k1 = parseFloat(result[3]);
                                inc_k2 = parseFloat(result[4], 1);
                            }
                            else {
                                patt = /([\d|.]*)\D*'\D*([\d|.]*)\/([\d|.]*)\D*"\D*/i;
                                result = lentext.match(patt);

                                if (result) {
                                    feet = parseFloat(result[1]);
                                    inc_k1 = parseFloat(result[2]);
                                    inc_k2 = parseFloat(result[3], 1);
                                }
                                else {
                                    patt = /([\d|.]*)\D*[ |-]\D*([\d|.]*)\/([\d|.]*)\D*"\D*/i;
                                    result = lentext.match(patt);

                                    if (result) {
                                        inc = parseFloat(result[1]);
                                        inc_k1 = parseFloat(result[2]);
                                        inc_k2 = parseFloat(result[3], 1);
                                    }
                                    else {
                                        patt = /([\d|.]*)\/([\d|.]*)\D*"\D*/i;
                                        result = lentext.match(patt);

                                        if (result) {
                                            inc_k1 = parseFloat(result[1]);
                                            inc_k2 = parseFloat(result[2], 1);
                                        }
                                        else {
                                            patt = /([\d|.]*)\D*'\D*([\d|.]*)\D*"\D*/i;
                                            result = lentext.match(patt);

                                            if (result) {
                                                feet = parseFloat(result[1]);
                                                inc = parseFloat(result[2]);
                                            }
                                            else {
                                                patt = /([\d|.]*)\D*'\D*$/i;
                                                result = lentext.match(patt);

                                                if (result) {
                                                    feet = parseFloat(result[1]);
                                                }
                                                else {
                                                    patt = /([\d|.]*)\D*"\D*$/i;
                                                    result = lentext.match(patt);

                                                    if (result) {
                                                        inc = parseFloat(result[1]);
                                                    }
                                                    else {
                                                        if ($.isNumeric(lentext)) {
                                                            inc = parseFloat(lentext);
                                                        }
                                                        else {
                                                            console.log('unit input syntax error');
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                    }
                                }
                            }
                            var res=feet * 12 + inc + inc_k1 / inc_k2;
                            if(options.allowNegativeNumbers && len_negatife)
                                res=-1*res;
                            return res;
                            break;
                        case 2:

                            var m = 0, cm = 0, mm = 0;
                            patt = /([\d|.]*)\D*m\D*([\d|.]*)\D*cm\D*([\d|.]*)\D*mm\D*/i;
                            result = lentext.match(patt);

                            if (result) {
                                m = parseFloat(result[1]);
                                cm = parseFloat(result[2]);
                                mm = parseFloat(result[3]);
                            }
                            else {
                                patt = /([\d|.]*)\D*m\D*([\d|.]*)\D*cm\D*/i;
                                result = lentext.match(patt);

                                if (result) {
                                    m = parseFloat(result[1]);
                                    cm = parseFloat(result[2]);
                                }
                                else {

                                    patt = /([\d|.]*)\D*cm\D*([\d|.]*)\D*mm\D*/i;
                                    result = lentext.match(patt);

                                    if (result) {
                                        cm = parseFloat(result[1]);
                                        mm = parseFloat(result[2]);
                                    }
                                    else {
                                        patt = /([\d|.]*)\D*mm\D*/i;
                                        result = lentext.match(patt);

                                        if (result) {
                                            mm = parseFloat(result[1]);
                                        }
                                        else {
                                            patt = /([\d|.]*)\D*cm\D*/i;
                                            result = lentext.match(patt);

                                            if (result) {
                                                cm = parseFloat(result[1]);
                                            }
                                            else {
                                                patt = /([\d|.]*)\D*m\D*/i;
                                                result = lentext.match(patt);

                                                if (result) {
                                                    m = parseFloat(result[1]);
                                                }
                                                else {
                                                    if ($.isNumeric(lentext)) {
                                                        cm = parseFloat(lentext);
                                                    }
                                                    else {
                                                        console.log('unit input syntax error');
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            var res=m * 100 + cm + mm / 10;
                            if(options.allowNegativeNumbers && len_negatife)
                                res=-1*res;
                            return res;
                            break;
                    }
                }
                else {
                    switch (unit) {
                        case 1:
                            return stFunctions.asFloat(wrapper.find('.feet').val()) * 12 + stFunctions.asFloat(wrapper.find('.inc').val()) + stFunctions.asFloat(wrapper.find('.inc-k-1').val(), 0) / stFunctions.asFloat(wrapper.find('.inc-k-2').val(), 1);
                            break;
                        case 2:
                            return stFunctions.asFloat(wrapper.find('.meter').val()) * 100 + stFunctions.asFloat(wrapper.find('.centimeter').val()) + stFunctions.asFloat(wrapper.find('.millimeter').val()) / 10;
                            break;
                    }
                }
            };

            function setUnitInputLength(unit, _length) {
                var _sensitivity = 0.125;
                if (typeof active_page !== 'undefined' && active_page) {
                    _sensitivity = active_page.this_page.sensitivity;
                }
                else if (typeof this_page !== 'undefined' && this_page) {
                    _sensitivity = this_page.sensitivity;
                }
                var sens_float_len = (_sensitivity + "").indexOf('.') >= 0 ? (_sensitivity + "").split(".")[1].length : 0;
                _length = stFunctions.round(stFunctions.round(_length / _sensitivity, 0) * _sensitivity, sens_float_len);
                unit = parseInt(unit);
                switch (unit) {
                    case 1:

                        var feet = Math.floor(_length / 12);
                        _length -= feet * 12;
                        var inc = Math.floor(_length);
                        _length -= inc;
                        var _k1k2 = stFunctions.getPayPayda(_length, _sensitivity);
                        if ((options.allowNegativeNumbers || _k1k2.pay > 0) && _k1k2.pay != _k1k2.payda) {
                            wrapper.find('.inc-k-1').val(_k1k2.pay);
                            wrapper.find('.inc-k-2').val(_k1k2.payda);
                        }
                        else {
                            wrapper.find('.inc-k-1').val("");
                            wrapper.find('.inc-k-2').val("");
                        }

                        wrapper.find('.feet').val(feet);
                        wrapper.find('.inc').val(inc);
                        break;
                    case 2:
                        var meter = Math.floor(_length / 100);
                        _length -= meter * 100;
                        var cm = Math.floor(_length);
                        _length -= cm;
                        var mm = _length * 10;

                        wrapper.find('.meter').val(meter);
                        wrapper.find('.centimeter').val(cm);
                        wrapper.find('.millimeter').val(mm);
                        break
                }
            }

            function setUnitInput1Length(unit, _length) {
                var _sensitivity = 0.125;
                if (typeof active_page !== 'undefined' && active_page) {
                    _sensitivity = active_page.this_page.sensitivity;
                }
                else if (typeof this_page !== 'undefined' && this_page) {
                    _sensitivity = this_page.sensitivity;
                }

                var negative = false;
                if (_length < 0) {
                    negative = true;
                    _length *= -1;
                }

                var sens_float_len = (_sensitivity + "").indexOf('.') >= 0 ? (_sensitivity + "").split(".")[1].length : 0;
                _length = stFunctions.round(stFunctions.round(_length / _sensitivity, 0) * _sensitivity, sens_float_len);


                unit = parseInt(unit);
                switch (unit) {
                    case 1:
                        var feet = Math.floor(_length / 12);
                        _length -= feet * 12;
                        var inc = Math.floor(_length);
                        _length -= inc;
                        var _k1k2 = stFunctions.getPayPayda(_length, _sensitivity);
                        var lentext = '';
                        lentext += feet > 0 ? feet + '\'' : '';

                        if (_k1k2.pay > 0 && _k1k2.pay != _k1k2.payda) {

                            lentext += (feet > 0 ? '-' : '') + (inc > 0 ? inc + ' ' : '') + _k1k2.pay + '/' + _k1k2.payda + '\"';
                        }
                        else {
                            lentext += inc > 0 ? (feet > 0 ? '-' : '') + inc + '\"' : '';
                        }
                        if (negative) {
                            lentext = '-' + lentext;
                        }
                        text_input.val($.trim(lentext));


                        break;
                    case 2:

                        var m = Math.floor(_length / 100);
                        _length -= m * 100;
                        var cm = stFunctions.round(_length, sens_float_len);
                        var lentext = '';
                        lentext += m > 0 ? m + 'm ' : '';
                        lentext += cm > 0 ? cm + 'cm' : '';

                        if (negative) {
                            lentext = '-' + lentext;
                        }
                        text_input.val($.trim(lentext));
                        break
                }
            }

            wrapper.setLength = function (_length) {
                var unit = parseInt(wrapper.attr('org-unit'));
                var input_type = wrapper.attr('input-type') ? parseInt(wrapper.attr('input-type')) : 0;
                if (input_type == 1) {
                    setUnitInput1Length(unit, _length);
                }
                else {
                    setUnitInputLength(unit, _length);
                }


            };


            return wrapper;

        },


        SensitivityUnitSelect: function () {
            var wrapper;
            this.each(function () {
                wrapper = $(this);
                var unit = wrapper.attr('unit') ? parseInt(wrapper.attr('unit')) : 1;
                var org_unit = parseInt(wrapper.attr('org-unit'));

                if (wrapper.hasClass('sensitivity-unit-select') && unit == org_unit) {

                }
                else {
                    wrapper.attr('org-unit', unit);
                    wrapper.addClass('sensitivity-unit-select');
                    wrapper.html("");

                    switch (unit) {
                        case 1:
                            wrapper.html(`
									<select class="sensitivity">
										<option value="0">0</option>
										<option value="0.5">1/2</option>
										<option value="0.25">1/4</option>
										<option value="0.125" selected>1/8</option>
										<option value="0.0625">1/16</option>
									</select>
									`);
                            break;

                        case 2:
                            wrapper.html(`
									<select class="sensitivity">
										<option value="0">0</option>
										<option value="0.1">0.1</option>
										<option value="0.01" selected>0.01</option>
										<option value="0.001">0.001</option>
										<option value="0.0001">0.0001</option>
									</select>
							`);
                            break;
                    }
                    if (wrapper.attr('default-val'))
                        setSensitivity(wrapper.attr('default-val'));
                }

            });

            wrapper.getSensitivity = function () {
                return wrapper.find('.sensitivity').val();
            };

            function setSensitivity(_sensitivity) {
                wrapper.find('.sensitivity').val(_sensitivity);
            }

            wrapper.setSensitivity = function (_sensitivity) {
                setSensitivity(_sensitivity);

            };


            return wrapper;

        },

        ScaleDefaultUnitSelect: function () {
            var wrapper;
            this.each(function () {
                wrapper = $(this);
                var unit = wrapper.attr('unit') ? parseInt(wrapper.attr('unit')) : 1;
                var org_unit = parseInt(wrapper.attr('org-unit'));

                if (wrapper.hasClass('scale-default-unit-select') && unit == org_unit) {

                }
                else {
                    wrapper.attr('org-unit', unit);
                    wrapper.addClass('sensitivity-unit-select');
                    wrapper.html("");

                    switch (unit) {
                        case 1:
                            wrapper.html(`
									<select id="scaleView" class="form-control">
									<option value="0.03125" reelValue="1">1/32" = 1' 0"</option>
									<option value="0.0625" reelValue="1">1/16" = 1' 0"</option>
									<option value="0.09375" reelValue="1">3/32" = 1' 0"</option>
									<option value="0.125" reelValue="1" selected>1/8" = 1' 0"</option>
									<option value="0.1875" reelValue="1">3/16" = 1' 0"</option>
									<option value="0.25" reelValue="1">1/4" = 1' 0"</option>
									<option value="0.375" reelValue="1">3/8" = 1' 0"</option>
									<option value="0.5" reelValue="1">1/2" = 1' 0"</option>
									<option value="0.75" reelValue="1">3/4" = 1' 0"</option>
									<option value="1.5" reelValue="1">1-1/2" = 1' 0"</option>
									<option value="3" reelValue="1">3" = 1' 0"</option>
									<option value="1" reelValue="1">1" = 1' 0"</option>
									<option value="1" reelValue="10">1" = 10' 0"</option>
									<option value="1" reelValue="20">1" = 20' 0"</option>
									<option value="1" reelValue="30">1" = 30' 0"</option>
									<option value="1" reelValue="40">1" = 40' 0"</option>
									<option value="1" reelValue="50">1" = 50' 0"</option>
									<option value="1" reelValue="60">1" = 60' 0"</option>
									<option value="1" reelValue="70">1" = 70' 0"</option>
									<option value="1" reelValue="80">1" = 80' 0"</option>
									<option value="1" reelValue="90">1" = 90' 0"</option>
									<option value="1" reelValue="100">1" = 100' 0"</option>

								</select>
									`);
                            break;

                        case 2:
                            wrapper.html(`
								<select id="scaleView" class="form-control" >
									<option value="0.05" reelValue="1">0.05cm = 1m</option>
									<option value="0.1" reelValue="1">0.1cm = 1m</option>
									<option value="0.125" reelValue="1" >0.125cm = 1m</option>
									<option value="0.25" reelValue="1">0.25cm = 1m</option>
									<option value="0.5" reelValue="1">0.5cm = 1m</option>
									<option value="0.75" reelValue="1">0.75cm = 1m</option>
									<option value="1" reelValue="1" selected>1cm = 1m</option>
									<option value="5" reelValue="1">5cm = 1m</option>
									<option value="7.5" reelValue="1">7.5cm = 1m</option>
									<option value="10" reelValue="1">10cm = 1m</option>
									<option value="50" reelValue="1">50cm =1m</option>
									<option value="100" reelValue="1">1m = 1m</option>
									<option value="100" reelValue="5">1m = 5m</option>
									<option value="100" reelValue="10">1m = 10m</option>
									<option value="100" reelValue="100">1m = 100m</option>
									<option value="100" reelValue="500">1m = 500m</option>

								</select>
							`);
                            break;
                    }
                    if (wrapper.attr('default-val'))
                        wrapper.find('#scaleView').val(wrapper.attr('default-val'));
                }

            });


            return wrapper;

        }


    });


}(jQuery));



